
const { body, param, query, validationResult } = require('express-validator');

// Validation middleware to handle errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// City validation rules
const validateCity = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('City name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('City name must be between 2 and 100 characters'),
  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Country must be between 2 and 100 characters'),
  handleValidationErrors
];

// Location validation rules
const validateLocation = [
  body('cityId')
    .isInt({ min: 1 })
    .withMessage('Valid city ID is required'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Location name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Location name must be between 2 and 200 characters'),
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  handleValidationErrors
];

// Pollutant validation rules
const validatePollutant = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Pollutant name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Pollutant name must be between 2 and 50 characters'),
  body('unit')
    .trim()
    .notEmpty()
    .withMessage('Unit is required')
    .isLength({ min: 1, max: 20 })
    .withMessage('Unit must be between 1 and 20 characters'),
  body('fullName')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Full name must not exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  handleValidationErrors
];

// Measurement validation rules
const validateMeasurement = [
  body('locationId')
    .isInt({ min: 1 })
    .withMessage('Valid location ID is required'),
  body('pollutantId')
    .isInt({ min: 1 })
    .withMessage('Valid pollutant ID is required'),
  body('value')
    .isFloat({ min: 0 })
    .withMessage('Value must be a positive number'),
  body('unit')
    .trim()
    .notEmpty()
    .withMessage('Unit is required'),
  body('timestamp')
    .isISO8601()
    .withMessage('Valid timestamp is required'),
  body('source')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Source must not exceed 100 characters'),
  body('aqi')
    .optional()
    .isInt({ min: 0, max: 500 })
    .withMessage('AQI must be between 0 and 500'),
  body('aqiLevel')
    .optional()
    .isIn(['good', 'moderate', 'unhealthy', 'bad', 'severe'])
    .withMessage('Invalid AQI level'),
  handleValidationErrors
];

// Historical data validation rules
const validateHistoricalData = [
  body('locationId')
    .isInt({ min: 1 })
    .withMessage('Valid location ID is required'),
  body('pollutantId')
    .isInt({ min: 1 })
    .withMessage('Valid pollutant ID is required'),
  body('value')
    .isFloat({ min: 0 })
    .withMessage('Value must be a positive number'),
  body('avgValue')
    .isFloat({ min: 0 })
    .withMessage('Average value must be a positive number'),
  body('minValue')
    .isFloat({ min: 0 })
    .withMessage('Minimum value must be a positive number'),
  body('maxValue')
    .isFloat({ min: 0 })
    .withMessage('Maximum value must be a positive number'),
  body('unit')
    .trim()
    .notEmpty()
    .withMessage('Unit is required'),
  body('date')
    .isDate()
    .withMessage('Valid date is required'),
  handleValidationErrors
];

// Query parameter validation
const validateDateRange = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO date'),
  handleValidationErrors
];

const validatePagination = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Limit must be between 1 and 1000'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be non-negative'),
  handleValidationErrors
];

const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
  handleValidationErrors
];

// Custom validation for coordinates
const validateCoordinates = [
  query('lat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  query('lng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  query('radius')
    .optional()
    .isInt({ min: 100, max: 50000 })
    .withMessage('Radius must be between 100 and 50000 meters'),
  handleValidationErrors
];

// Export validation rules
const validateExportFormat = [
  query('format')
    .optional()
    .isIn(['csv', 'json'])
    .withMessage('Format must be either csv or json'),
  handleValidationErrors
];

module.exports = {
  validateCity,
  validateLocation,
  validatePollutant,
  validateMeasurement,
  validateHistoricalData,
  validateDateRange,
  validatePagination,
  validateId,
  validateCoordinates,
  validateExportFormat,
  handleValidationErrors
};
