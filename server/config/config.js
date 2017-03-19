const path = require('path');

let config = {};
config.options = { root: path.normalize(__dirname + '/../../client/') };
config.clientId = 5893;
config.authProvider = {
    authUrl: 'https://www.strava.com/oauth/authorize',
    clientId: 5893,
    redirectUri: 'https://backup.jklass.net/bikes/'

};
config.clientSecret = process.env.CLIENTSECRET;

module.exports = config;