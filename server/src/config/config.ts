import * as path from 'path';
import { AppConfig } from '../../../types/models';

const config: AppConfig = {
  options: {
    root: path.normalize(__dirname + '/../../client/')
  },
  strava: {
    authProvider: {
      authUrl: 'https://www.strava.com/oauth/authorize',
      clientId: process.env.NODE_ENV === 'dev' ? 5893 : 5893,
      redirectUri: process.env.NODE_ENV === 'dev' ? 'http://localhost:3000/login' : 'https://trackmybike.herokuapp.com/login',
      scope: 'read,activity:read,profile:read_all'
    },
    clientSecret: process.env.CLIENTSECRET || ''
  },
  mongo: {
    url: process.env.NODE_ENV === 'dev'
      ? 'mongodb://localhost/strava'
      : `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@ds157624.mlab.com:57624/strava`
  }
};

console.log(config.mongo.url);

export default config;