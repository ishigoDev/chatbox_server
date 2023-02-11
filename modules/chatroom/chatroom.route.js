const route = require('express').Router();
const auth = require('../../middleware/auth.middleware')
const chat = require('./chatroom.controller');

//create-add
// route.post('/:sender/:receiver',auth.verifyToken,chat.chatMessage)
route.post('/:sender/:receiver',chat.chatMessage)


module.exports = route;