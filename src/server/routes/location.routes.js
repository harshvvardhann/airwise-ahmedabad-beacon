
const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');
const { validateLocation, validateId } = require('../utils/validators');
const { asyncHandler } = require('../middleware/errorHandler');

router.get('/', asyncHandler(locationController.getAllLocations));
router.get('/:id', validateId, asyncHandler(locationController.getLocationById));
router.get('/city/:cityId', validateId, asyncHandler(locationController.getLocationsByCityId));
router.post('/', validateLocation, asyncHandler(locationController.createLocation));
router.put('/:id', validateId, validateLocation, asyncHandler(locationController.updateLocation));
router.delete('/:id', validateId, asyncHandler(locationController.deleteLocation));

module.exports = router;
