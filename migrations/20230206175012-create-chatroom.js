'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";').then(async()=>{
      await queryInterface.createTable('chatrooms', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
        },
        created_by: {
          allowNull: false,
          type: Sequelize.UUID,
          
        },
        members: {
          allowNull: false,
          type: Sequelize.ARRAY({
            type: Sequelize.UUID,
            references: {
              model: 'users',
              key: 'id',
            },
          }),
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        deleted_at: {
          type: Sequelize.DATE,
        },        
      });
    })    
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('chatrooms');
  }
};