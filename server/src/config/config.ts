import 'dotenv/config';
import * as path from 'path';
import { AppConfig } from '../../../types/models';

const config: AppConfig = {
  options: {
    root: path.normalize(__dirname + '/../../client/')
  },
  strava: {
    authProvider: {
      authUrl: 'https://www.strava.com/oauth/authorize',
      clientId: parseInt(process.env.STRAVA_CLIENT_ID || '0'),
      redirectUri: 'http://localhost:3500/login',
      scope: 'read,activity:read_all,profile:read_all'
    },
    clientSecret: process.env.STRAVA_CLIENT_SECRET || ''
  },
  mongo: {
    url: 'mongodb://localhost:27017/strava'
  }
};

console.log(config.mongo.url);

export default config;