'use strict';
const bcrypt = require('bcrypt');

module.exports = {
    async up(queryInterface, Sequelize) {
        const hashedPassword = bcrypt.hashSync('admin123', 10);

        await queryInterface.bulkInsert('users', [
            {
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@airwise.com',
                password: hashedPassword,
                mobile: '1234567890',
                status: '1',
                isEmailVerified: '1',
                isPasswordChangeRequired: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('users', { email: 'admin@airwise.com' }, {});
    },
};
