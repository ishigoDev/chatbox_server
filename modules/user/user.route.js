const router = require('express').Router();
const rule = require('./user.validator.js')
const userController = require('./user.controller.js');
const jwt = require('../../utility/jwtToken');
//Create User
router.post('/create',rule.userBody,rule.verifyRules,userController.create)
//Sign In User
router.post('/sign-in',rule.userSign,rule.verifyRules,userController.signin);

module.exports = router;