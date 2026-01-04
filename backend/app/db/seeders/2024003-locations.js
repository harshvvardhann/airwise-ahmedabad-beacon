'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Note: This assumes city with id=1 (Ahmedabad) exists
        await queryInterface.bulkInsert(
            'locations',
            [
                {
                    id: 1,
                    cityId: 1,
                    name: 'Maninagar',
                    latitude: 23.0225,
                    longitude: 72.5714,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    cityId: 1,
                    name: 'Satellite',
                    latitude: 23.0276,
                    longitude: 72.5295,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 3,
                    cityId: 1,
                    name: 'Navrangpura',
                    latitude: 23.0413,
                    longitude: 72.5559,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 4,
                    cityId: 1,
                    name: 'GIFT City',
                    latitude: 23.1607,
                    longitude: 72.6815,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 5,
                    cityId: 1,
                    name: 'Bopal',
                    latitude: 23.0368,
                    longitude: 72.4625,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete(
            'locations',
            {
                cityId: 1,
            },
            {}
        );
    },
};

