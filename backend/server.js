require('dotenv').config();
require('./utils/lib/cronjob/index');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const Redis = require('ioredis');
const db = require('./app/db/models');
const { initKafka } = require('./services/kafka');
const { errorHandler, notFoundHandler } = require('./app/middlewares/errorHandler');
const { generalLimiter } = require('./app/middlewares/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Redis client
const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        return Math.min(times * 50, 2000);
    },
});

// Make Redis client available throughout the app
app.locals.redisClient = redisClient;

// Time when request started
app.use((req, res, next) => {
    req.startTime = performance.now();
    next();
});

//* Helmet
app.use(helmet());

//* Morgan
app.use(morgan('combined'));

// Conditionally apply body parsers
app.use((req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
        return next();
    }
    express.urlencoded({ limit: '70mb', extended: true })(req, res, next);
});

app.use((req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
        return next();
    }
    express.json({
        limit: '70mb',
        verify: (req, res, buf) => {
            req.rawBody = buf.toString();
        },
    })(req, res, next);
});

//* Response Compression
app.use(compression());

//* CORS Options
app.use(
    cors({
        origin: '*',
    })
);

//* Sequelize Connection
db.sequelize
    .authenticate()
    .then(() => {
        console.log('DB connected!');
    })
    .catch((err) => {
        console.error('DB connection failed!', err.message);
    });

//* App Routes
const V1Routes = '/api/v1';
app.use(V1Routes, require('./app/routes_controller'));

// Health check route
app.get('/health', async (req, res) => {
    try {
        await db.sequelize.authenticate();
        await redisClient.ping();

        return res.status(200).json({
            status: 'OK',
            message: 'Server is running',
            timestamp: new Date().toISOString(),
            services: {
                database: 'connected',
                redis: 'connected',
                kafka: 'connected',
            },
        });
    } catch (error) {
        console.error('Health check failed:', error);
        return res.status(503).json({
            status: 'Service Unavailable',
            message: 'One or more services are down',
            timestamp: new Date().toISOString(),
            error: error.message,
        });
    }
});

app.get('/', (req, res) => {
    return res.json({ message: 'Server running.', lastUpdated: new Date().toISOString() });
});

// Initialize Kafka (optional - continue if fails)
async function initServices() {
    try {
        await initKafka();
        console.log('✅ Kafka initialized successfully');
    } catch (error) {
        console.warn('⚠️  Kafka initialization failed (continuing without Kafka):', error.message);
    }

    try {
        await redisClient.ping();
        console.log('✅ Redis connection established successfully');
    } catch (error) {
        console.warn('⚠️  Redis connection failed (continuing without Redis):', error.message);
    }
}

//* Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

//* Server
const httpServer = app.listen(process.env.PORT || 5000, async function () {
    console.log('Magic happens on localhost:' + (process.env.PORT || 5000));
    await initServices();
});

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received: closing HTTP server`);

    httpServer.close(async () => {
        console.log('HTTP server closed');

        try {
            await redisClient.quit();
            console.log('Redis connection closed');
        } catch (error) {
            console.error('Error closing Redis connection:', error);
        }

        try {
            await db.sequelize.close();
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

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

module.exports = app;
