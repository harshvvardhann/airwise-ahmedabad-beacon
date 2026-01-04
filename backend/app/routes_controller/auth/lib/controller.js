'use strict';

const db = require('../../../../app/db/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { status, common } = require('../../../../utils');

// User signup
exports.signup = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { firstName, lastName, email, password, mobile } = req.body;

        // Check if user already exists
        const existingUser = await db.User.findOne({
            where: { email },
            transaction,
        });

        if (existingUser) {
            await transaction.rollback();
            return res.status(status.Conflict).json({ message: 'User with this email already exists.' });
        }

        // Create new user
        const user = await db.User.create(
            {
                firstName,
                lastName,
                email,
                password,
                mobile,
                status: '1',
                isEmailVerified: '0',
                isPasswordChangeRequired: false,
            },
            { transaction }
        );

        const payload = {
            user: {
                id: user.id,
                email: user.email,
            },
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key-change-in-production', {
            expiresIn: process.env.TOKEN_EXPIRE || '7d',
        });

        const userData = {
            id: user.id,
            userName: `${user.firstName} ${user.lastName}`,
            email: user.email,
            mobile: user.mobile,
            profileImage: user.profileImage,
        };

        await transaction.commit();

        return res.status(status.CREATED).json({
            message: 'User registered successfully',
            accessToken: token,
            userData: userData,
        });
    } catch (err) {
        await transaction.rollback();
        return common.throwException(err, 'Signup User', req, res);
    }
};

// User login
exports.login = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { email, password } = req.body;

        const user = await db.User.scope('withPassword').findOne({
            where: {
                email,
                status: '1',
            },
            transaction,
        });

        if (!user) {
            await transaction.rollback();
            return res.status(status.NotFound).json({ message: 'Invalid credentials.' });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            await transaction.rollback();
            return res.status(status.NotFound).json({ message: 'Invalid credentials.' });
        }

        const payload = {
            user: {
                id: user.id,
                email: user.email,
            },
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key-change-in-production', {
            expiresIn: req.body.rememberMe ? process.env.TOKEN_EXPIRE_MAX || '30d' : process.env.TOKEN_EXPIRE_MIN || '7d',
        });

        const userData = {
            id: user.id,
            userName: `${user.firstName} ${user.lastName}`,
            email: user.email,
            mobile: user.mobile,
            profileImage: user.profileImage,
            isPasswordChangeRequired: user.isPasswordChangeRequired,
            emailNotifications: user.emailNotifications ?? true,
            pushNotifications: user.pushNotifications ?? true,
        };

        await transaction.commit();

        return res.status(status.OK).json({
            message: 'Login Success',
            accessToken: token,
            userData: userData,
        });
    } catch (err) {
        await transaction.rollback();
        return common.throwException(err, 'Login User', req, res);
    }
};

// Verify token
exports.verifyToken = async (req, res) => {
    try {
        const user = req.user;

        const userData = {
            id: user.id,
            userName: `${user.firstName} ${user.lastName}`,
            email: user.email,
            mobile: user.mobile,
            profileImage: user.profileImage,
            isPasswordChangeRequired: user.isPasswordChangeRequired,
            emailNotifications: user.emailNotifications,
            pushNotifications: user.pushNotifications,
        };

        return res.status(status.OK).json({
            message: 'Token Verified',
            userData: userData,
        });
    } catch (err) {
        return common.throwException(err, 'Verify Token', req, res);
    }
};

// Get notification preferences
exports.getNotificationPreferences = async (req, res) => {
    try {
        const user = req.user;

        return res.status(status.OK).json({
            message: 'Notification preferences retrieved successfully',
            data: {
                emailNotifications: user.emailNotifications ?? true,
                pushNotifications: user.pushNotifications ?? true,
            },
        });
    } catch (err) {
        return common.throwException(err, 'Get Notification Preferences', req, res);
    }
};

// Update notification preferences
exports.updateNotificationPreferences = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { emailNotifications, pushNotifications } = req.body;
        const user = req.user;

        const updateData = {};
        if (emailNotifications !== undefined) {
            updateData.emailNotifications = emailNotifications;
        }
        if (pushNotifications !== undefined) {
            updateData.pushNotifications = pushNotifications;
        }

        await db.User.update(updateData, {
            where: { id: user.id },
            transaction,
        });

        await transaction.commit();

        // Fetch updated user
        const updatedUser = await db.User.findByPk(user.id);

        return res.status(status.OK).json({
            message: 'Notification preferences updated successfully',
            data: {
                emailNotifications: updatedUser.emailNotifications,
                pushNotifications: updatedUser.pushNotifications,
            },
        });
    } catch (err) {
        await transaction.rollback();
        return common.throwException(err, 'Update Notification Preferences', req, res);
    }
};
