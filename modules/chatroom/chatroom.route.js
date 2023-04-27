const route = require('express').Router();
const auth = require('../../middleware/auth.middleware')
const chat = require('./chatroom.controller');

//create-message
route.post('/:sender/:receiver',auth.verifyToken,chat.chatMessage)

//fetch-chatroom-message
route.get('/:sender/:receiver',auth.verifyToken,chat.fetchMessage);


module.exports = route;