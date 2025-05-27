
const express = require('express');
const router = express.Router();
const cityController = require('../controllers/city.controller');
const { validateCity, validateId } = require('../utils/validators');
const { asyncHandler } = require('../middleware/errorHandler');

router.get('/', asyncHandler(cityController.getAllCities));
router.get('/:id', validateId, asyncHandler(cityController.getCityById));
router.post('/', validateCity, asyncHandler(cityController.createCity));
router.put('/:id', validateId, validateCity, asyncHandler(cityController.updateCity));
router.delete('/:id', validateId, asyncHandler(cityController.deleteCity));

module.exports = router;
