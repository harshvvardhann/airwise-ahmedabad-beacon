'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('air_quality_predictions', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            locationId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'locations',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            timestamp: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            predictionData: {
                type: Sequelize.TEXT,
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
        await queryInterface.addIndex('air_quality_predictions', ['locationId'], {
            name: 'idx_predictions_locationId',
        });
        await queryInterface.addIndex('air_quality_predictions', ['timestamp'], {
            name: 'idx_predictions_timestamp',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('air_quality_predictions');
    },
};

