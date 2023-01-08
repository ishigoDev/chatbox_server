const db = require('../../models/index');
const user = db.user;
const {errorHandler} = require('../../utility/errorHandler');
const bcrypt = require('bcryptjs')
const jwt = require('../../utility/jwtToken');
const err = new Error();

const create = async (req,res)=>{
    try{ 
        const createdUser = await user.createUser(req);
        return res.status(200).json({
            status:200,
            message:'User Created Successfully ! Redirecting ...'
        })
    }catch(error){
        if(error.name == 'SequelizeUniqueConstraintError'){
            error.message =`User already present with this ${error.errors[0].value} ! Kindly check and try again`
        }
        const err = new errorHandler(error);
        return res.status(err.statusCode).send(err);
    }
}
const signin = async (req,res)=>{
    try{ 
        const body = req.body;
        const userDetail = await user.findByEmail(body.email);
        if(!bcrypt.compareSync(body.password,userDetail.password)){
            err.message = 'Invalid password. Please enter the correct password for this account. 🙂'
            err.statusCode = 403
            throw err
        }
        const jwtToken =  await jwt.generateToken(userDetail);        
        return res.status(200).json({
            status:200,
            token:jwtToken
        })
    }catch(error){
        const err = new errorHandler(error);
        return res.status(err.statusCode).send(err);
    }
}
const chatroom = async (req,res)=>{
    try{         
        const users = await user.getAllUser(req);     
        return res.status(200).json({
            status:200,
            users:users
        })
    }catch(error){
        const err = new errorHandler(error);
        return res.status(err.statusCode).send(err);
    }
}
module.exports = {create,signin,chatroom}