import { StravaActivity, StravaAthlete } from './strava';

export interface SessionData {
  _id: number;
  athleteId: number;
  accessToken: string;
  sessionId: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface AthleteDocument extends StravaAthlete {
  _id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ActivityDocument extends StravaActivity {
  _id: number;
  athleteId?: number;
  synced?: boolean;
  syncedAt?: Date;
}

export interface MongoCollectionNames {
  athlete: string;
  activity: string;
  session: string;
}

export interface DatabaseConfig {
  url: string;
}

export interface AppConfig {
  options: {
    root: string;
  };
  strava: {
    authProvider: {
      authUrl: string;
      clientId: number;
      redirectUri: string;
      scope: string;
    };
    clientSecret: string;
  };
  mongo: DatabaseConfig;
}