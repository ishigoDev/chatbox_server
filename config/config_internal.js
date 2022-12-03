const env = require('dotenv');
const path = require('path');

const envConfig = env.config({path: path.resolve(`.env.${process.env.NODE_ENV}`)});
module.exports = envConfig;