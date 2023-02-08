'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chatroom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.users,{
      //   as:'created',
      //   foreignKey:'created_by'
      // })
      // this.belongsTo(models.users,{
      //   as:'other_user',
      //   foreignKey:'members'
      // })
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
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });
  return chatroom;
};