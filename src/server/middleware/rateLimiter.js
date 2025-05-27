
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');

// Create Redis client for rate limiting
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  }
});

// General API rate limiter
const generalLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for data fetching endpoints
const dataFetchLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per minute
  message: {
    error: 'Too many data fetch requests, please try again later.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Very strict limiter for external API calls
const externalAPILimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // limit each IP to 5 requests per 5 minutes
  message: {
    error: 'Too many external API requests, please try again later.',
    retryAfter: '5 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Export and create endpoint limiter
const exportLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 exports per hour
  message: {
    error: 'Too many export requests, please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Create account limiter (for registration, etc.)
const createAccountLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 account creation attempts per hour
  message: {
    error: 'Too many account creation attempts, please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Dynamic rate limiter based on user type
const dynamicLimiter = (options = {}) => {
  return rateLimit({
    store: new RedisStore({
      sendCommand: (...args) => redisClient.call(...args),
    }),
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: options.max || 100,
    keyGenerator: (req) => {
      // Use user ID if authenticated, otherwise IP
      return req.user?.id || req.ip;
    },
    skip: (req) => {
      // Skip rate limiting for admin users
      return req.user?.role === 'admin';
    },
    message: {
      error: options.message || 'Rate limit exceeded',
      retryAfter: options.retryAfter || '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Cleanup function for graceful shutdown
const cleanup = async () => {
  try {
    await redisClient.quit();
    console.log('Rate limiter Redis connection closed');
  } catch (error) {
    console.error('Error closing rate limiter Redis connection:', error);
  }
};

module.exports = {
  generalLimiter,
  dataFetchLimiter,
  externalAPILimiter,
  exportLimiter,
  createAccountLimiter,
  dynamicLimiter,
  cleanup
};
