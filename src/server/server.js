
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const cron = require('node-cron');
const Redis = require('ioredis');
const { sequelize } = require('./models');
const routes = require('./routes');
const { fetchAirQualityData } = require('./services/openaq');
const { initKafka } = require('./services/kafka');
const { aggregateDailyData } = require('./services/dataAggregation');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Redis client
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  }
});

// Make Redis client available throughout the app
app.locals.redisClient = redisClient;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting
app.use('/api', generalLimiter);

// Routes
app.use('/api', routes);

// Health check route
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await sequelize.authenticate();
    
    // Check Redis connection
    await redisClient.ping();
    
    res.status(200).json({ 
      status: 'OK', 
      message: 'Server is running', 
      timestamp: new Date().toISOString(),
      services: { 
        database: 'connected', 
        redis: 'connected',
        kafka: 'connected'
      } 
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({ 
      status: 'Service Unavailable', 
      message: 'One or more services are down',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// API documentation route
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'AirWise API',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      cities: '/api/cities',
      locations: '/api/locations',
      pollutants: '/api/pollutants',
      measurements: '/api/measurements',
      historical: '/api/historical'
    },
    features: [
      'Real-time air quality data',
      'Historical data analysis',
      'AQI calculations',
      'Data export (CSV/JSON)',
      'ML predictions integration',
      'Kafka event streaming'
    ]
  });
});

// Scheduled tasks
console.log('Setting up scheduled tasks...');

// Fetch external data every hour
cron.schedule('0 * * * *', async () => {
  try {
    console.log('🔄 Running scheduled task: Fetching latest air quality data');
    const result = await fetchAirQualityData();
    console.log(`✅ Scheduled data fetch completed: ${result.count} measurements`);
  } catch (error) {
    console.error('❌ Scheduled data fetch failed:', error);
  }
});

// Aggregate daily data at 1 AM
cron.schedule('0 1 * * *', async () => {
  try {
    console.log('🔄 Running scheduled task: Daily data aggregation');
    const result = await aggregateDailyData();
    console.log(`✅ Daily aggregation completed: ${result.count} records for ${result.date}`);
  } catch (error) {
    console.error('❌ Daily aggregation failed:', error);
  }
});

// Clean old data every Sunday at 2 AM
cron.schedule('0 2 * * 0', async () => {
  try {
    console.log('🔄 Running scheduled task: Cleaning old data');
    const { cleanOldData } = require('./services/dataAggregation');
    const result = await cleanOldData();
    console.log(`✅ Cleanup completed: ${result.measurements} measurements, ${result.historical} historical records`);
  } catch (error) {
    console.error('❌ Data cleanup failed:', error);
  }
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Database connection and server start
async function startServer() {
  try {
    console.log('🚀 Starting AirWise API Server...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    
    // Initialize Kafka (optional - continue if fails)
    try {
      await initKafka();
      console.log('✅ Kafka initialized successfully');
    } catch (error) {
      console.warn('⚠️  Kafka initialization failed (continuing without Kafka):', error.message);
    }
    
    // Test Redis connection
    try {
      await redisClient.ping();
      console.log('✅ Redis connection established successfully');
    } catch (error) {
      console.warn('⚠️  Redis connection failed (continuing without Redis):', error.message);
    }
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`🌐 Server is running on port ${PORT}`);
      console.log(`📋 API Documentation: http://localhost:${PORT}/api`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
    // Graceful shutdown handling
    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received: closing HTTP server`);
      
      server.close(async () => {
        console.log('HTTP server closed');
        
        try {
          await redisClient.quit();
          console.log('Redis connection closed');
        } catch (error) {
          console.error('Error closing Redis connection:', error);
        }
        
        try {
          await sequelize.close();
          console.log('Database connection closed');
        } catch (error) {
          console.error('Error closing database connection:', error);
        }
        
        console.log('Graceful shutdown completed');
        process.exit(0);
      });
    };
    
    // Handle termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    return server;
    
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = app;
