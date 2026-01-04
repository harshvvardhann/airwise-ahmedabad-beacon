'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            'pollutants',
            [
                {
                    id: 1,
                    name: 'pm25',
                    fullName: 'Fine Particulate Matter',
                    description: 'Particles with a diameter of 2.5 micrometers or less',
                    unit: 'μg/m³',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    name: 'pm10',
                    fullName: 'Particulate Matter',
                    description: 'Particles with a diameter of 10 micrometers or less',
                    unit: 'μg/m³',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 3,
                    name: 'no2',
                    fullName: 'Nitrogen Dioxide',
                    description: 'Toxic gas produced by combustion processes',
                    unit: 'ppb',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 4,
                    name: 'so2',
                    fullName: 'Sulfur Dioxide',
                    description: 'Toxic gas with a strong odor',
                    unit: 'ppb',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 5,
                    name: 'co',
                    fullName: 'Carbon Monoxide',
                    description: 'Colorless, odorless toxic gas',
                    unit: 'ppm',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 6,
                    name: 'o3',
                    fullName: 'Ozone',
                    description: 'Reactive gas composed of three oxygen atoms',
                    unit: 'ppb',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete(
            'pollutants',
            {
                name: {
                    [Sequelize.Op.in]: ['pm25', 'pm10', 'no2', 'so2', 'co', 'o3'],
                },
            },
            {}
        );
    },
};

