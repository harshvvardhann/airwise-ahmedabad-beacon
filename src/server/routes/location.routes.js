
const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');

router.get('/', locationController.getAllLocations);
router.get('/:id', locationController.getLocationById);
router.get('/city/:cityId', locationController.getLocationsByCityId);
router.post('/', locationController.createLocation);
router.put('/:id', locationController.updateLocation);
router.delete('/:id', locationController.deleteLocation);

module.exports = router;
