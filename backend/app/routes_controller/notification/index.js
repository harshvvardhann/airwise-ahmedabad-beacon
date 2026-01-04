'use strict';

const router = require('express').Router();
const auth = require('../../middlewares/middleware');
const controller = require('./lib/controller');

// get all notifications
router.get('/notifications', auth, controller.findAll);

// mark notification as read
router.put('/notification/:id/read', auth, controller.markAsRead);

module.exports = router;

