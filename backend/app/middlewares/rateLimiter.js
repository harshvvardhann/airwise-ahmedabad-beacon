const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const Redis = require('ioredis');

// ---------------------------
// Redis Client Configuration
// ---------------------------
let redisConnected = false;
const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        return Math.min(times * 50, 2000);
    },
    enableOfflineQueue: true, // Enable queue so commands can be queued when not connected
    lazyConnect: true, // Don't connect immediately
});

// Handle Redis connection errors gracefully (don't crash the server)
redisClient.on('error', (err) => {
    redisConnected = false;
    // Silently handle errors - rate limiter will fall back to in-memory
    if (err.code !== 'ECONNREFUSED') {
        console.warn('⚠️  Redis connection error for rate limiting:', err.message);
    }
});

redisClient.on('connect', () => {
    redisConnected = true;
    console.log('✅ Rate limiter Redis connection established');
});

redisClient.on('ready', () => {
    redisConnected = true;
});

redisClient.on('close', () => {
    redisConnected = false;
});

// Try to connect, but don't fail if Redis is unavailable
redisClient.connect().catch(() => {
    // Redis not available - will use in-memory fallback
    console.warn('⚠️  Redis not available for rate limiting, using in-memory fallback');
});

// ---------------------------
// Helper to Create Redis Store with Unique Prefix
// Returns undefined if Redis is not available (will use in-memory fallback)
// Note: RedisStore constructor executes Redis commands immediately, so we need
// to ensure Redis is ready before creating stores. For now, we use in-memory
// to allow server to start without Redis.
// ---------------------------
const createRedisStore = (prefix) => {
    // For now, always return undefined to use in-memory rate limiting
    // This ensures the server starts even if Redis is not available
    // TODO: Implement lazy RedisStore creation once Redis connection is established
    return undefined;
};

// ---------------------------
// Helper to Simplify Limiters
// Uses Redis if available, otherwise falls back to in-memory
// ---------------------------
const rateLimiterWithStore = (opts, prefix) => {
    const store = createRedisStore(prefix);
    return rateLimit({
        store: store, // undefined = in-memory fallback
        standardHeaders: true,
        legacyHeaders: false,
        ...opts,
    });
};

// ---------------------------
// General API Rate Limiter
// ---------------------------
const generalLimiter = rateLimiterWithStore(
    {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 1000,
        message: {
            error: 'Too many requests from this IP, please try again later.',
            retryAfter: '15 minutes',
        },
    },
    'rl:general:'
);

// ---------------------------
// Stricter Data Fetch Limiter
// ---------------------------
const dataFetchLimiter = rateLimiterWithStore(
    {
        windowMs: 60 * 1000, // 1 minute
        max: 10,
        message: {
            error: 'Too many data fetch requests, please try again later.',
            retryAfter: '1 minute',
        },
    },
    'rl:datafetch:'
);

// ---------------------------
// Very Strict External API Limiter
// ---------------------------
const externalAPILimiter = rateLimiterWithStore(
    {
        windowMs: 5 * 60 * 1000, // 5 minutes
        max: 5,
        message: {
            error: 'Too many external API requests, please try again later.',
            retryAfter: '5 minutes',
        },
    },
    'rl:external:'
);

// ---------------------------
// Export Request Limiter
// ---------------------------
const exportLimiter = rateLimiterWithStore(
    {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 20,
        message: {
            error: 'Too many export requests, please try again later.',
            retryAfter: '1 hour',
        },
    },
    'rl:export:'
);

// ---------------------------
// Account Creation Limiter
// ---------------------------
const createAccountLimiter = rateLimiterWithStore(
    {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 5,
        message: {
            error: 'Too many account creation attempts, please try again later.',
            retryAfter: '1 hour',
        },
    },
    'rl:createaccount:'
);

// ---------------------------
// Dynamic Limiter (per-user / role-based)
// ---------------------------
const dynamicLimiter = (options = {}) => {
    const store = createRedisStore(options.prefix || 'rl:dynamic:');
    return rateLimit({
        store: store, // undefined = in-memory fallback
        windowMs: options.windowMs || 15 * 60 * 1000,
        max: options.max || 100,
        keyGenerator: (req) => req.user?.id || req.ip,
        skip: (req) => req.user?.role === 'admin',
        message: {
            error: options.message || 'Rate limit exceeded',
            retryAfter: options.retryAfter || '15 minutes',
        },
        standardHeaders: true,
        legacyHeaders: false,
        ...options,
    });
};

// ---------------------------
// Graceful Shutdown
// ---------------------------
const cleanup = async () => {
    try {
        await redisClient.quit();
        console.log('Rate limiter Redis connection closed');
    } catch (error) {
        console.error('Error closing rate limiter Redis connection:', error);
    }
};

// ---------------------------
// Exports
// ---------------------------
module.exports = {
    generalLimiter,
    dataFetchLimiter,
    externalAPILimiter,
    exportLimiter,
    createAccountLimiter,
    dynamicLimiter,
    cleanup,
};
