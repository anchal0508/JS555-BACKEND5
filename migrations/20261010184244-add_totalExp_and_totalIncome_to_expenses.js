'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await Promise.all([
      queryInterface.addColumn('Expenses', 'totalExp', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }),
      queryInterface.addColumn('Expenses', 'totalIncome', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      })
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // await Promise.all([
    //   queryInterface.removeColumn('Expenses', 'totalExp'),
    //   queryInterface.removeColumn('Expenses', 'totalIncome')
    // ]);
  }
};
