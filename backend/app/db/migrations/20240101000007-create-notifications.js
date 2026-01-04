'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('notifications', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            type: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            message: {
                type: Sequelize.STRING(500),
                allowNull: false,
            },
            data: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            read: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            timestamp: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            },
        });

        // Add indexes for faster queries
        await queryInterface.addIndex('notifications', ['read'], {
            name: 'idx_notifications_read',
        });
        await queryInterface.addIndex('notifications', ['timestamp'], {
            name: 'idx_notifications_timestamp',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('notifications');
    },
};

