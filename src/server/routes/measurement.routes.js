
const express = require('express');
const router = express.Router();
const measurementController = require('../controllers/measurement.controller');
const { 
  validateMeasurement, 
  validateDateRange, 
  validatePagination, 
  validateId 
} = require('../utils/validators');
const { dataFetchLimiter, externalAPILimiter } = require('../middleware/rateLimiter');
const { asyncHandler } = require('../middleware/errorHandler');

// Apply pagination validation to list endpoints
router.get('/', validatePagination, validateDateRange, asyncHandler(measurementController.getAllMeasurements));
router.get('/latest', dataFetchLimiter, asyncHandler(measurementController.getLatestMeasurements));
router.get('/filter', validateDateRange, validatePagination, asyncHandler(measurementController.filterMeasurements));

// Individual measurement endpoints
router.get('/:id', validateId, asyncHandler(measurementController.getMeasurementById));

// Location and pollutant specific endpoints
router.get('/location/:locationId', validateId, validatePagination, asyncHandler(measurementController.getMeasurementsByLocation));
router.get('/pollutant/:pollutantId', validateId, validatePagination, asyncHandler(measurementController.getMeasurementsByPollutant));

// Data modification endpoints
router.post('/', validateMeasurement, asyncHandler(measurementController.createMeasurement));
router.put('/:id', validateId, validateMeasurement, asyncHandler(measurementController.updateMeasurement));
router.delete('/:id', validateId, asyncHandler(measurementController.deleteMeasurement));

// External data fetching (rate limited)
router.post('/fetch-latest', externalAPILimiter, asyncHandler(measurementController.fetchLatestData));

module.exports = router;
