const router = require('express').Router();
const rule = require('./user.validator.js')
const userController = require('./user.controller.js');
const auth = require('../../middleware/auth.middleware')
//Create User
router.post('/create',rule.userBody,rule.verifyRules,userController.create)
//Sign In User
router.post('/sign-in',rule.userSign,rule.verifyRules,userController.signin);
//ChatRoom 
router.get('/chatroom',auth.verifyToken,userController.chatroom)
//Sign Out
router.get('/sign-out',auth.verifyToken,userController.signOut)

module.exports = router;