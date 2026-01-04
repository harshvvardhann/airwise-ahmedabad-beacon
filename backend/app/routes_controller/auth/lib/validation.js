'use strict';

const { body } = require('express-validator');
const db = require('../../../../app/db/models');

const signupRules = () => {
    return [
        body('firstName').notEmpty().trim().withMessage('First Name is required.'),
        body('lastName').notEmpty().trim().withMessage('Last Name is required.'),
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required.')
            .isEmail()
            .withMessage('Enter a valid email')
            .custom(async (value) => {
                try {
                    const user = await db.User.findOne({
                        where: {
                            email: value?.toLowerCase(),
                        },
                    });
                    if (user) {
                        return Promise.reject('Email already in use.');
                    }
                    return true;
                } catch (err) {
                    return Promise.reject('Something went wrong');
                }
            }),
        body('password')
            .notEmpty()
            .withMessage('Password is required field')
            .isLength({ min: 8 })
            .withMessage('Minimum 8 characters is required'),
        body('mobile').optional({ nullable: true }),
    ];
};

const loginRules = () => {
    return [
        body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Enter valid email.'),
        body('password').notEmpty().withMessage('Password is required'),
    ];
};

module.exports = {
    signupRules,
    loginRules,
};
