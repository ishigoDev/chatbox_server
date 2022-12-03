const redis = require('redis');
const client = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});


/**
 * Method to connect the redis cache server
 * @returns promise for the connection of redis
 */
const connectRedis = function () {
    return new Promise((resolve, reject) => {
        client.connect();
        client.on('connect', function () {
            return resolve(client);
        });
        client.on('error', function (err) {
            return reject(err);
        })
    })
};

/**
 * Method to set the key - value in redis cache
 * @param {String} key 
 * @param {String} value 
 * @returns promises for handling the setup of data
 */

const setInRedis = function (key, value) {
    return new Promise((resolve, reject) => {
        client.set(key, value, function (err, result) {
            if (!err) {
                return resolve(result);
            } else {
                return reject(err);
            }
        });
    });
};

/**
 * Method to set expiry data in redis cache.
 * @param {String} key The Key for redis bucket.
 * @param {Strng} value The value which will store with that key.
 * @return {Promise} the connection handling promise.
 **/
const setExpiryInRedis = function (key, value) {
    return new Promise((resolve, reject) => {
        client.set(key, value, 'EX', 60 * 60, function (err, result) {
            if (!err) {
                return resolve(result);
            } else {
                return reject(err);
            }
        });
    });
};

/**
 * Method to get the data from redis cache.
 * @param {String} key The Key for redis bucket.
 * @return {Promise} the connection handling promise.
 **/
const getFromRedis = function (key) {
    return new Promise((resolve, reject) => {
        client.get(key, function (err, result) {
            if (!err) {
                return resolve(JSON.parse(result));
            } else {
                return reject(err);
            }
        });
    });
};

/**
 * Method to delete the data from redis cache.
 * @param {String} key The Key for redis bucket.
 * @return {Promise} the connection handling promise.
 **/
const delFromRedis = function (key) {
    return new Promise((resolve, reject) => {
        client.del(key, function (err, result) {
            if (!err) {
                return resolve(result);
            } else {
                return reject(err);
            }
        });
    });
};


module.exports = { connectRedis, setInRedis, setExpiryInRedis, getFromRedis, delFromRedis };

