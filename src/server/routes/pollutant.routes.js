
const express = require('express');
const router = express.Router();
const pollutantController = require('../controllers/pollutant.controller');

router.get('/', pollutantController.getAllPollutants);
router.get('/:id', pollutantController.getPollutantById);
router.post('/', pollutantController.createPollutant);
router.put('/:id', pollutantController.updatePollutant);
router.delete('/:id', pollutantController.deletePollutant);

module.exports = router;
