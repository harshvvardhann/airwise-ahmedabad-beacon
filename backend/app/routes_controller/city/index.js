const router = require('express').Router();
const controller = require('./lib/controller');
const { validationRules } = require('./lib/validation');
const { expressValidate } = require('../../../utils/lib/common-function');

// get all city
router.get('/city', controller.findAll);

// get city by id
router.get('/city/:id', controller.findOne);

// create city
router.post('/city', validationRules(), expressValidate, controller.create);

// update city
router.put('/city/:id', validationRules(), expressValidate, controller.update);

// delete city
router.delete('/city/:id', controller.delete);

module.exports = router;

