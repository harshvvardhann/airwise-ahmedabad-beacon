const { body } = require('express-validator');

const validationRules = () => {
    return [
        body('name').notEmpty().trim().withMessage('City name is required.'),
        body('country').notEmpty().trim().withMessage('Country is required.'),
    ];
};

module.exports = {
    validationRules,
};

