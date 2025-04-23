
const express = require('express');
const router = express.Router();
const historicalController = require('../controllers/historical.controller');

router.get('/', historicalController.getAllHistoricalData);
router.get('/:id', historicalController.getHistoricalDataById);
router.get('/location/:locationId', historicalController.getHistoricalDataByLocation);
router.get('/pollutant/:pollutantId', historicalController.getHistoricalDataByPollutant);
router.get('/filter', historicalController.filterHistoricalData);
router.post('/', historicalController.createHistoricalData);
router.put('/:id', historicalController.updateHistoricalData);
router.delete('/:id', historicalController.deleteHistoricalData);
router.get('/export', historicalController.exportData);

module.exports = router;
