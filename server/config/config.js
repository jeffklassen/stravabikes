const path = require('path');

let config = {};
config.options = { root: path.normalize(__dirname + '/../../') };
config.clientId = 5893;
config.clientSecret = process.env.CLIENTSECRET;

module.exports = config;