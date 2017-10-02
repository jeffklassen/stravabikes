const path = require('path');

let config = {};
config.options = { root: path.normalize(__dirname + '/../../client/') };

config.strava = {
    authProvider : {
        authUrl: 'https://www.strava.com/oauth/authorize',
        clientId: 5893,
        redirectUri: process.env.NODE_ENV == 'dev'?'http://localhost:3000/login': 'http://localhost:3000/login'
    
    },
    clientSecret : process.env.CLIENTSECRET
};



config.mongo = {
    url : process.env.NODE_ENV == 'dev' ? 'mongodb://localhost/strava' : 'mongodb://mongo:27017/strava'
};

module.exports = config;