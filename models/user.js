'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init({
    id:{
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal('uuid_generate_v4()'),
      allowNull:false,
    },
    displayName: DataTypes.STRING(100),
    email: {
      type:DataTypes.STRING(200),
      allowNull:false,
      unique:true,
    },
    password: {
      type:DataTypes.STRING(255),
      set(value) {
        if (value) {
          this.setDataValue('password', bcrypt.hashSync(value, 10))
        }
      },
    }
  }, {
    sequelize,
    modelName: 'user',
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  user.createUser = async (data)=>{
    const body = data.body;
    const payload={
      email:body.email,
      displayName:body.displayName,
      password:body.password
    }
    const createdUser = await user.create(payload);
    return createdUser;
  }
  return user;
};