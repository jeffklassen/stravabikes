import * as path from 'path';
import { AppConfig } from '../../../types/models';

const config: AppConfig = {
  options: {
    root: path.normalize(__dirname + '/../../client/')
  },
  strava: {
    authProvider: {
      authUrl: 'https://www.strava.com/oauth/authorize',
      clientId: 5893,
      redirectUri: 'http://localhost:3000/login',
      scope: 'read,activity:read,profile:read_all'
    },
    clientSecret: process.env.CLIENTSECRET || ''
  },
  mongo: {
    url: 'mongodb://localhost:27017/strava'
  }
};

console.log(config.mongo.url);

export default config;