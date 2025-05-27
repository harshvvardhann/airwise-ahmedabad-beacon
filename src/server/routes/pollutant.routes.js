
const express = require('express');
const router = express.Router();
const pollutantController = require('../controllers/pollutant.controller');
const { validatePollutant, validateId } = require('../utils/validators');
const { asyncHandler } = require('../middleware/errorHandler');

router.get('/', asyncHandler(pollutantController.getAllPollutants));
router.get('/:id', validateId, asyncHandler(pollutantController.getPollutantById));
router.post('/', validatePollutant, asyncHandler(pollutantController.createPollutant));
router.put('/:id', validateId, validatePollutant, asyncHandler(pollutantController.updatePollutant));
router.delete('/:id', validateId, asyncHandler(pollutantController.deletePollutant));

module.exports = router;
