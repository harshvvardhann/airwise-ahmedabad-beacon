
const express = require('express');
const router = express.Router();
const measurementController = require('../controllers/measurement.controller');

router.get('/', measurementController.getAllMeasurements);
router.get('/latest', measurementController.getLatestMeasurements);
router.get('/:id', measurementController.getMeasurementById);
router.get('/location/:locationId', measurementController.getMeasurementsByLocation);
router.get('/pollutant/:pollutantId', measurementController.getMeasurementsByPollutant);
router.get('/filter', measurementController.filterMeasurements);
router.post('/', measurementController.createMeasurement);
router.put('/:id', measurementController.updateMeasurement);
router.delete('/:id', measurementController.deleteMeasurement);
router.post('/fetch-latest', measurementController.fetchLatestData);

module.exports = router;
