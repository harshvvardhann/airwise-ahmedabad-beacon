'use strict';

const router = require('express').Router();
const auth = require('../../middlewares/middleware');
const controller = require('./lib/controller');
const { validationRules } = require('./lib/validation');
const { expressValidate } = require('../../../utils/lib/common-function');

// get all locations
router.get('/locations', auth, controller.findAll);

// get location by id
router.get('/location/:id', auth, controller.findOne);

module.exports = router;

