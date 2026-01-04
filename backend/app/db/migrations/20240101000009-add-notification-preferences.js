'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('users', 'emailNotifications', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Enable/disable email notifications',
        });

        await queryInterface.addColumn('users', 'pushNotifications', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Enable/disable push notifications',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('users', 'emailNotifications');
        await queryInterface.removeColumn('users', 'pushNotifications');
    },
};
