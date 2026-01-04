'use strict';

const db = require('../../../../app/db/models');
const { status, common } = require('../../../../utils');
const { Op } = require('sequelize');

// Get all notifications
exports.findAll = async (req, res) => {
    try {
        const { read, limit = 50 } = req.query;

        const whereClause = {};
        if (read !== undefined) {
            whereClause.read = read === 'true';
        }

        const notifications = await db.Notification.findAll({
            where: whereClause,
            order: [['timestamp', 'DESC']],
            limit: parseInt(limit),
        });

        return res.status(status.OK).json({ data: notifications });
    } catch (err) {
        return common.throwException(err, 'Get Notifications', req, res);
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await db.Notification.findByPk(id);

        if (!notification) {
            return res.status(status.NotFound).json({ message: 'Notification not found.' });
        }

        notification.read = true;
        await notification.save();

        return res.status(status.OK).json({ message: 'Notification marked as read.', data: notification });
    } catch (err) {
        return common.throwException(err, 'Mark Notification as Read', req, res);
    }
};

