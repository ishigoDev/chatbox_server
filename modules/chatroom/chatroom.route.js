const route = require('express').Router();
const auth = require('../../middleware/auth.middleware')
const chat = require('./chatroom.controller');

//create-add
route.post('/:sender/:receiver',auth.verifyToken,chat.chatMessage)


module.exports = route;