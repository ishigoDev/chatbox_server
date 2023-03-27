const router = require('express').Router();
const user = require('./user/user.route');
const chat = require('./chatroom/chatroom.route')

router.use('/user',user);
router.use('/chat',chat);

module.exports = router;