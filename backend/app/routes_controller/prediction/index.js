'use strict';

const router = require('express').Router();
const auth = require('../../middlewares/middleware');
const controller = require('./lib/controller');

// get predictions
router.get('/predictions', auth, controller.findAll);

module.exports = router;

