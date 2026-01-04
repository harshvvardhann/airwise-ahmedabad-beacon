'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            'cities',
            [
                {
                    id: 1,
                    name: 'Ahmedabad',
                    country: 'India',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete(
            'cities',
            {
                name: 'Ahmedabad',
            },
            {}
        );
    },
};

