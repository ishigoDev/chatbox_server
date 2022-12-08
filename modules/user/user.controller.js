const db = require('../../models/index');
const user = db.user;
const {errorHandler} = require('../../utility/errorHandler');
const create = async (req,res)=>{
    try{ 
        const createdUser = await user.createUser(req);
        return res.status(200).json({
            status:200,
            message:createdUser
        })
    }catch(error){
        if(error.name == 'SequelizeUniqueConstraintError'){
            error.message =`User already present with this ${error.errors[0].value} ! Kindly check and try again`
        }
        const err = new errorHandler(error);
        return res.status(err.statusCode).send(err);
    }
}
module.exports = {create}