'use strict';

const jwt = require('jsonwebtoken');
const db = require('../db/models');
const { status } = require('../../utils');

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization || null;
        if (!token) {
            return res.status(status.Unauthorized).json({ message: 'Unauthorized access.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');

        if (!decoded) {
            return res.status(status.Unauthorized).json({ message: 'Unauthorized access.' });
        }

        const user = await db.User.scope('withPassword').findOne({
            where: {
                id: decoded.user.id,
                status: '1',
            },
        });

        if (!user) {
            return res.status(status.Unauthorized).json({
                message: 'Unauthorized access.',
            });
        }

        // Add the current user instance in request.
        req.user = user;
        return next();
    } catch (err) {
        return res.status(status.Unauthorized).json({ message: 'Unauthorized access.' });
    }
};

module.exports = authenticateUser;
