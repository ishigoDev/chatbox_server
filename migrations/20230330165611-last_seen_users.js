'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users','last_seen',{
      type:Sequelize.DATE,
      allowNull:true,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users','last_seen');
  }
};
