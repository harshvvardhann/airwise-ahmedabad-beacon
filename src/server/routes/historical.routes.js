
const express = require('express');
const router = express.Router();
const historicalController = require('../controllers/historical.controller');
const { 
  validateHistoricalData, 
  validateDateRange, 
  validatePagination, 
  validateId,
  validateExportFormat 
} = require('../utils/validators');
const { exportLimiter } = require('../middleware/rateLimiter');
const { asyncHandler } = require('../middleware/errorHandler');

// List endpoints with validation
router.get('/', validatePagination, validateDateRange, asyncHandler(historicalController.getAllHistoricalData));
router.get('/filter', validateDateRange, validatePagination, asyncHandler(historicalController.filterHistoricalData));

// Export endpoint (rate limited)
router.get('/export', exportLimiter, validateExportFormat, validateDateRange, asyncHandler(historicalController.exportData));

// Individual record endpoints
router.get('/:id', validateId, asyncHandler(historicalController.getHistoricalDataById));

// Location and pollutant specific endpoints
router.get('/location/:locationId', validateId, validatePagination, asyncHandler(historicalController.getHistoricalDataByLocation));
router.get('/pollutant/:pollutantId', validateId, validatePagination, asyncHandler(historicalController.getHistoricalDataByPollutant));

// Data modification endpoints
router.post('/', validateHistoricalData, asyncHandler(historicalController.createHistoricalData));
router.put('/:id', validateId, validateHistoricalData, asyncHandler(historicalController.updateHistoricalData));
router.delete('/:id', validateId, asyncHandler(historicalController.deleteHistoricalData));

module.exports = router;
