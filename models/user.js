'use strict';
const {
  Model,
  Op,
  Sequelize
} = require('sequelize');
let allModels;
const bcrypt = require('bcryptjs');
const {delFromRedis} = require('../utility/redis')
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.chatroom,{
        as: 'chat',
        foreignKey:'created_by',
      })
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
    },  
    last_seen:{
      type:DataTypes.DATE,
      allowNull:true
    }
  }, {
    sequelize,
    modelName: 'user',
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  user.registerAllModels = function(models) {
    allModels = models;
  };
  user.createUser = async (data)=>{
    const body = data.body;
    const payload={
      email:body.email,
      displayName:body.displayName,
      password:body.password,
      last_seen:sequelize.literal('CURRENT_TIMESTAMP'),
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
  user.getAllUser = async (id)=>{
    const whereOptions ={
      id:{
        [Op.ne]: id 
      }
    }
    const queryOption = {
      where:whereOptions,
      attributes:['displayName','email','session','id','last_seen']
    }
    const result = await user.findAll(queryOption)
    return result;
  }
  user.saveLastSeen = async (id) =>{
    const whereOptions ={
      id:id
    }
    const result = await user.update({
      last_seen:sequelize.literal('CURRENT_TIMESTAMP')
    },{where:whereOptions});
    if(!result){
      const err = new Error()
      err.statusCode = 422
      err.message = `Something went Wrong !`
      throw err
    }
    return {
      result:result,     
    }
  }
  user.signOut = async (data) =>{
    const userId = data.user.id;
    const redisId = data.user.redisId;
    const whereOptions = {
      id:userId
    }
    delFromRedis(redisId)
    const result = await user.update({session:null},{where:whereOptions});    
    if(!result){
      const err = new Error()
      err.statusCode = 422
      err.message = `Something went Wrong !`
      throw err
    }
    return true ;
  }
  return user;
};