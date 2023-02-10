'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user,{
        as:'sender',
        foreignKey:'created_by'
      })
      this.belongsTo(models.chatroom,{
        as:'chatroom',
        foreignKey:'chatroom_id'
      })
    }
  }
  messages.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue:sequelize.literal('uuid_generate_v4()'),
    },
    chatroom_id: {
      type: DataTypes.UUID,
      allowNull:false,
      references: {
        model: 'chatroom',
        key: 'id',
      },
    },
    sender_id:{
      type:DataTypes.UUID,
      allowNull:false,
      references:{
        model:'users',
        key:'id'
      }
    },
    message:{
      type: DataTypes.STRING,
      allowNull:false
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'messages',
  });
  return messages;
};