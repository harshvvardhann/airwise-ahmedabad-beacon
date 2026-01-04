'use strict';

const router = require('express').Router();
const auth = require('../../middlewares/middleware');
const controller = require('./lib/controller');

// get current air quality measurements
router.get('/measurements/current', auth, controller.getCurrent);

// get historical measurements
router.get('/measurements/historical', auth, controller.getHistorical);

module.exports = router;

