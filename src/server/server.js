
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

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Redis client
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    return Math.min(times * 50, 2000); // Exponential backoff
  }
});

// Make Redis client available throughout the app
app.locals.redisClient = redisClient;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check route
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await sequelize.authenticate();
    
    // Check Redis connection
    await redisClient.ping();
    
    res.status(200).json({ status: 'OK', message: 'Server is running', services: { db: 'connected', redis: 'connected' } });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({ 
      status: 'Service Unavailable', 
      message: 'One or more services are down',
      error: error.message
    });
  }
});

// Schedule data fetch every hour
cron.schedule('0 * * * *', async () => {
  try {
    console.log('Running scheduled task: Fetching latest air quality data');
    await fetchAirQualityData();
    console.log('Completed scheduled task: Data fetch successful');
  } catch (error) {
    console.error('Scheduled task failed:', error);
  }
});

// Database connection and server start
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Initialize Kafka
    await initKafka();
    
    // Test Redis connection
    await redisClient.ping();
    console.log('Redis connection has been established successfully.');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  
  await redisClient.quit();
  await sequelize.close();
  
  process.exit(0);
});

startServer();

module.exports = app;
