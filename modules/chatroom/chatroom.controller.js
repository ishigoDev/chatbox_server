const db = require('../../models/index');
const chatroom = db.chatroom;
const {errorHandler} = require('../../utility/errorHandler');
const err = new Error();

const chatMessage = async (req,res)=>{
    try{ 
        const hello = await chatroom.createMember(req);
        return res.status(200).json({
            status:200,
            message:'User Created Successfully ! Redirecting ...'
        })
    }catch(error){     
        const err = new errorHandler(error);
        return res.status(err.statusCode).send(err);   
    }
}
module.exports = {chatMessage}
