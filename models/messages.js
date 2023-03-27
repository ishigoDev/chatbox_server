'use strict';
const {
  Model
} = require('sequelize');
let allModels;
module.exports = (sequelize, DataTypes) => {
  class messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, {
        as: 'sender',
        foreignKey: 'sender_id'
      })
      this.belongsTo(models.chatroom, {
        as: 'chatroom',
        foreignKey: 'chatroom_id'
      })
    }
  }
  messages.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: sequelize.literal('uuid_generate_v4()'),
    },
    chatroom_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'chatroom',
        key: 'id',
      },
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'messages',
    tableName: 'messages',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  messages.registerAllModels = function (models) {
    allModels = models;
  };
  messages.saveMessage = async function (chatroom_id, sender_id, message) {
    const result = await messages.create({
      chatroom_id: chatroom_id,
      sender_id: sender_id,
      message: message,
    });
    return result;
  }
  return messages;
};