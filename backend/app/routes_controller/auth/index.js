'use strict';

const router = require('express').Router();
const auth = require('../../middlewares/middleware');
const controller = require('./lib/controller');
const { signupRules, loginRules } = require('./lib/validation');
const { expressValidate } = require('../../../utils/lib/common-function');

// Signup
router.post('/signup', signupRules(), expressValidate, controller.signup);

// Login
router.post('/login', loginRules(), expressValidate, controller.login);

// Verify token
router.get('/verify-token', auth, controller.verifyToken);

// Get notification preferences
router.get('/notification-preferences', auth, controller.getNotificationPreferences);

// Update notification preferences
router.put('/notification-preferences', auth, controller.updateNotificationPreferences);

module.exports = router;
