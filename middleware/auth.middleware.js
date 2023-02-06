const err = new Error();
const jwt = require('jsonwebtoken');
const { getFromRedis } = require('../utility/redis');
const {errorHandler} = require('../utility/errorHandler');

const verifyToken = async function (req, res, next) {
    try {
        if (!req.headers['authorization']) {
            err.statusCode = 422;
            err.message = 'Auth Header is missing.';
            throw err;
        }

        const token = req.headers['authorization'].split(' ')[1];

        if (!token) {
            err.statusCode = 403;
            err.message = 'No token provided.';
            throw err;
        }
        const decoded = await jwt.verify(token,process.env['JWT_SECRET_KEY']);

        if (!decoded) {
            err.statusCode = 403;
            err.message = 'Invalid auth token.';
            throw err;
        }
        const userDetails = await getFromRedis(decoded);        
        if (!userDetails) {
            err.statusCode = 403;
            err.message = 'Required login.';
            throw err;
        }

        req.user = userDetails;
        req.user.redisId = decoded;
        return next();
    } catch (error) {
        const err = errorHandler(error);
        return res.status(err.statusCode).send(err);
    }
}

module.exports = {
    verifyToken
}