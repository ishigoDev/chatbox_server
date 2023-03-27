'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";').then(async()=>{
    await queryInterface.createTable('messages', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue:Sequelize.literal('uuid_generate_v4()'),
      },
      chatroom_id: {
        type: Sequelize.UUID,
        allowNull:false,
        references: {
          model: 'chatrooms',
          key: 'id',
        },
      },
      sender_id:{
        type:Sequelize.UUID,
        allowNull:false,
        references:{
          model:'users',
          key:'id'
        }
      },
      message:{
        type: Sequelize.STRING,
        allowNull:false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('messages');
  }
};