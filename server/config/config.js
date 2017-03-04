const path = require('path');

let config = {};
config.options = { root: path.normalize(__dirname + '/../../') };
config.clientId = 5893;
config.authProvider = {
    authUrl: 'https://www.strava.com/oauth/authorize',
    clientId: 5893,
    redirectUri: 'http://127.0.0.1:3000/client/'

};
config.clientSecret = process.env.CLIENTSECRET;

module.exports = config;