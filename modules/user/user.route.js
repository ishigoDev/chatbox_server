const router = require('express').Router();
const rule = require('./user.validator.js')
const userController = require('./user.controller.js');
router.post('/create',rule.userBody,rule.verifyRules,userController.create)

module.exports = router;