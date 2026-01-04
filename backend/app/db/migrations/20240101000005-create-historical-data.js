'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('historical_data', {
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
            date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            avgValue: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            minValue: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            maxValue: {
                type: Sequelize.FLOAT,
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

        // Add unique constraint
        await queryInterface.addIndex('historical_data', ['locationId', 'pollutantId', 'date'], {
            unique: true,
            name: 'unique_historical_data',
        });

        // Add indexes for faster queries
        await queryInterface.addIndex('historical_data', ['locationId'], {
            name: 'idx_historical_data_locationId',
        });
        await queryInterface.addIndex('historical_data', ['date'], {
            name: 'idx_historical_data_date',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('historical_data');
    },
};

