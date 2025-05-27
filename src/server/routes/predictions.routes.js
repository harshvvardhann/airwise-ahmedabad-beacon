
const express = require('express');
const router = express.Router();
const predictionsController = require('../controllers/predictions.controller');
const { validateId, validatePagination } = require('../utils/validators');
const { dataFetchLimiter } = require('../middleware/rateLimiter');
const { asyncHandler } = require('../middleware/errorHandler');

router.get('/', validatePagination, asyncHandler(predictionsController.getAllPredictions));
router.get('/location/:locationId', validateId, asyncHandler(predictionsController.getPredictionsByLocation));
router.post('/location/:locationId/generate', validateId, dataFetchLimiter, asyncHandler(predictionsController.generatePredictionsForLocation));

module.exports = router;
