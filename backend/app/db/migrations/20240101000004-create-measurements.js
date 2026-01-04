'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('measurements', {
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
            pollutantId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'pollutants',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },
            value: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            unit: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            source: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            timestamp: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            aqi: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            aqiLevel: {
                type: Sequelize.ENUM('good', 'moderate', 'unhealthy', 'bad', 'severe'),
                allowNull: true,
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

        // Add unique constraint to prevent duplicate measurements
        await queryInterface.addIndex('measurements', ['locationId', 'pollutantId', 'timestamp'], {
            unique: true,
            name: 'unique_measurement',
        });

        // Add indexes for faster queries
        await queryInterface.addIndex('measurements', ['locationId'], {
            name: 'idx_measurements_locationId',
        });
        await queryInterface.addIndex('measurements', ['pollutantId'], {
            name: 'idx_measurements_pollutantId',
        });
        await queryInterface.addIndex('measurements', ['timestamp'], {
            name: 'idx_measurements_timestamp',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('measurements');
    },
};

