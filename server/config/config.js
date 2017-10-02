const path = require('path');

let config = {};
config.options = { root: path.normalize(__dirname + '/../../client/') };

config.strava = {
    authProvider : {
        authUrl: 'https://www.strava.com/oauth/authorize',
        clientId: 5893,
        redirectUri: process.env.NODE_ENV == 'dev'?'http://localhost:3000/login': 'https://trackmybike.herokuapp.com/login'
    
    },
    clientSecret : process.env.CLIENTSECRET
};



config.mongo = {
    url : process.env.NODE_ENV == 'dev' ? 'mongodb://localhost/strava' : 'mongodb://' + process.env.MONGO_USERNAME + ':' + process.env.MONGO_PASSWORD + '@ds157624.mlab.com:57624/strava'
};

console.log(config.mongo.url);

module.exports = config;