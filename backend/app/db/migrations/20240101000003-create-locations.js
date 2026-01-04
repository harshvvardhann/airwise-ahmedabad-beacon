'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('locations', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            cityId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'cities',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },
            name: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            latitude: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            longitude: {
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

        // Add index on cityId for faster queries
        await queryInterface.addIndex('locations', ['cityId'], {
            name: 'idx_locations_cityId',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('locations');
    },
};

