'use strict';
const {
  Model,
  Op
} = require('sequelize');
const bcrypt = require('bcryptjs');
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
      }      
    },
    session:{
      type:DataTypes.STRING(255),
      allowNull:true
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
  user.findByEmail = async (data)=>{        
    const email = data;
    const whereOptions = {
      email:email,
    }
    const queryOptions = {
      where: whereOptions
    }
    return await user.findOne(queryOptions);
  }
  user.manageSession = async (redisKey,userId)=>{
    let oldSession = null;
    const userDetail = await user.findByPk(userId);
    if(userDetail.dataValues.session){
      oldSession = userDetail.dataValues.session;
    }
    const result = await user.update({
      session:redisKey
    },{
      where:{
        id:userId
      }
    })
    if(!result){
      const err = new Error()
      err.statusCode = 422
      err.message = `Something went Wrong !`
      throw err
    }
    return {
      result:result,
      oldSession:oldSession
    }
  }
  user.getAllUser = async (data)=>{
    const whereOptions ={
      id:{
        [Op.ne]: data.user.id
      }
    }
    const queryOption = {
      where:whereOptions
    }
    const result = await user.findAll(queryOption)
    return result;
  }
  return user;
};