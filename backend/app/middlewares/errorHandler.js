const { status } = require('../../utils');

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Sequelize validation errors
    if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map((error) => ({
            field: error.path,
            message: error.message,
        }));

        return res.status(status.BadRequest).json({
            message: 'Validation error',
            errors,
        });
    }

    // Sequelize unique constraint errors
    if (err.name === 'SequelizeUniqueConstraintError') {
        const field = err.errors[0]?.path || 'field';
        return res.status(status.Conflict).json({
            message: `${field} already exists`,
            error: 'Duplicate entry',
        });
    }

    // Sequelize foreign key constraint errors
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(status.BadRequest).json({
            message: 'Invalid reference to related record',
            error: 'Foreign key constraint',
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(status.Unauthorized).json({
            message: 'Invalid token',
            error: 'Authentication failed',
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(status.Unauthorized).json({
            message: 'Token expired',
            error: 'Authentication failed',
        });
    }

    // Axios errors (external API calls)
    if (err.isAxiosError) {
        const errorStatus = err.response?.status || status.InternalServerError;
        const message = err.response?.data?.message || 'External API error';

        return res.status(errorStatus).json({
            message: 'External service error',
            error: message,
        });
    }

    // Rate limiting errors
    if (err.status === 429) {
        return res.status(429).json({
            message: 'Too many requests',
            error: 'Rate limit exceeded',
        });
    }

    // File upload errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(status.BadRequest).json({
            message: 'File too large',
            error: 'File size limit exceeded',
        });
    }

    // Database connection errors
    if (err.name === 'SequelizeConnectionError') {
        return res.status(503).json({
            message: 'Database connection error',
            error: 'Service temporarily unavailable',
        });
    }

    // Default error
    const errorStatus = err.status || err.statusCode || status.InternalServerError;
    const message = err.message || 'Internal server error';

    // Don't expose internal errors in production
    const isDevelopment = process.env.NODE_ENV === 'development';

    res.status(errorStatus).json({
        message: isDevelopment ? message : 'Internal server error',
        ...(isDevelopment && { stack: err.stack }),
        error: isDevelopment ? err : undefined,
    });
};

// 404 handler for undefined routes
const notFoundHandler = (req, res) => {
    res.status(status.NotFound).json({
        message: 'Route not found',
        path: req.originalUrl,
        method: req.method,
    });
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    errorHandler,
    notFoundHandler,
    asyncHandler,
};

