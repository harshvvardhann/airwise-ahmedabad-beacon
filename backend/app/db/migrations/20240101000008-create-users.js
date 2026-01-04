'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            firstName: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            lastName: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            email: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            mobile: {
                type: Sequelize.STRING(20),
                allowNull: true,
            },
            profileImage: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM('0', '1'),
                allowNull: true,
                defaultValue: '1',
                comment: '0 for InActive, 1 for Active',
            },
            isEmailVerified: {
                type: Sequelize.ENUM('0', '1'),
                allowNull: true,
                defaultValue: '0',
            },
            isPasswordChangeRequired: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('users');
    },
};
