'use strict';

const { body } = require('express-validator');

const validationRules = () => {
    return [
        body('name').notEmpty().trim().withMessage('Location name is required.'),
        body('cityId').notEmpty().withMessage('City is required.'),
        body('latitude').notEmpty().isFloat().withMessage('Valid latitude is required.'),
        body('longitude').notEmpty().isFloat().withMessage('Valid longitude is required.'),
    ];
};

module.exports = {
    validationRules,
};

