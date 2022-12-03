const router = require('express').Router();
const rule = require('./user.validator.js')
router.post('/save',rule.userBody,rule.verifyRules,(req,res)=>{
    return res.status(202).json({
        "messae":'skfjsd'
    })
})


module.exports = router;