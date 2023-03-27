const db = require('../../models/index');
const chatroom = db.chatroom;
const {errorHandler} = require('../../utility/errorHandler');
const err = new Error();

const chatMessage = async (req,res)=>{
    try{ 
        const created = await chatroom.createMember(req);        
        if(created){
            return res.status(200).json({
                status:200,
                message:'Message Sent !',
                message:created
            })
        }else{
            err.message = 'Somethin Went Wrong ! Please try again !'
            err.statusCode = 500
            throw err
        } 
    }catch(error){     
        const err = new errorHandler(error);
        return res.status(err.statusCode).send(err);   
    }
}

const fetchMessage = async (req,res)=>{
    try{ 
        const fetched = await chatroom.fetchMessage(req);
        return res.status(200).json({
            status:200,
            message:fetched 
        })
    }catch(error){     
        const err = new errorHandler(error);
        return res.status(err.statusCode).send(err);   
    }
}
module.exports = {chatMessage,fetchMessage}
