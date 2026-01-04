'use strict';

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            firstName: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            lastName: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
                set(value) {
                    this.setDataValue('email', value?.toLowerCase());
                },
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
                set(value) {
                    this.setDataValue('password', bcrypt.hashSync(value, 10));
                },
            },
            mobile: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            profileImage: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('0', '1'),
                allowNull: true,
                defaultValue: '1',
                comment: '0 for InActive, 1 for Active',
            },
            isEmailVerified: {
                type: DataTypes.ENUM('0', '1'),
                allowNull: true,
                defaultValue: '0',
            },
            isPasswordChangeRequired: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            },
            emailNotifications: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                comment: 'Enable/disable email notifications',
            },
            pushNotifications: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                comment: 'Enable/disable push notifications',
            },
        },
        {
            tableName: 'users',
            timestamps: true,
            defaultScope: {
                attributes: {
                    exclude: ['password'],
                },
            },
            scopes: {
                withPassword: {
                    attributes: {
                        include: ['password'],
                    },
                },
            },
        }
    );

    User.associate = (models) => {
        // Add associations here if needed in the future
    };

    return User;
};
