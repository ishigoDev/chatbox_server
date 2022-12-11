const {setInRedis,delFromRedis} = require('./redis.js');
const jwt = require('jsonwebtoken')
const db = require('../models/index.js');
const {uuid} = require('uuidv4');
const user = db.user;
/**
 * Method to generate the JWT token.
 * @param {Object} user The user object.
 * @return {String} JWT Token.
 **/
const generateToken = async function(data) {
    const payload = {
      id: data.id,
      email: data.email
    };
    const redisKey = `session:${uuid()}`;
    setInRedis(redisKey, JSON.stringify(payload));      
    const {oldSession} = await user.manageSession(redisKey,data.id);
    if(oldSession){
      delFromRedis(oldSession)
    }
    const jwtToken = await jwt.sign(redisKey, process.env.JWT_SECRET_KEY);
    return jwtToken;
  };
  
module.exports ={
    generateToken
}