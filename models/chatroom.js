'use strict';
const {
  Model
} = require('sequelize');
let allModels;
module.exports = (sequelize, DataTypes) => {
  class chatroom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongs(models.user,{
        as:'created',
        foreignKey:'created_by'
      })
      this.hasMany(models.messages,{
        as:'messages',
        foreignKey:'chatroom_id'
      })
    }
  }
  chatroom.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: sequelize.literal('uuid_generate_v4()'),
    },
    created_by: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    members: {
      type: DataTypes.ARRAY({
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
    }),}
  }, {
    sequelize,
    modelName: 'chatroom',
    paranoid: true,
    tableName:'chatrooms',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });
  chatroom.registerAllModels = function(models) {
    allModels = models;
  };
  chatroom.createMember = async function(data){
    return 'hello';
  }
  return chatroom;
};