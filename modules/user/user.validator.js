const { body, validationResult } = require('express-validator');

const verifyRules = function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array().shift();
        const payload = {
            statusCode: 422,
            message: error.msg,
            param: error.param,
            value: error.value,
        };
        return res.status(422).jsonp(payload);
    } else {
        next();
    }
};

const userBody = [
    body('email')
        .notEmpty()
        .withMessage('Email cannot be empty')
        .isEmail()
        .trim()
        .withMessage('Please enter correct email'),
    body('password')
        .notEmpty()
        .withMessage('Password cannot be empty')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 chars long')
        .matches(/\d/)
        .withMessage('Password must contain a number'),
    body('displayName')
        .notEmpty()
        .withMessage('Name cannot be empty')
        .trim()        
]

module.exports = {
    verifyRules,
    userBody
};