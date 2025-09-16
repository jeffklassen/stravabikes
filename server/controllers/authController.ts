import config from '../config/config';
import { getAuthToken, getAthlete } from '../clients/stravaclient';
import { mapTokenToAthlete, insertAthlete, getSessionData } from '../clients/mongoclient';
import * as uuid from 'uuid';
import { StravaAuthProvider } from '../../types/strava';
import { SessionData } from '../../types/models';

interface AuthController {
  getAuthDetails: () => Promise<StravaAuthProvider>;
  isAuthenticated: (sessionId: string) => Promise<SessionData | null>;
  connectToStrava: (authCode: string) => Promise<string>;
}

const authController: AuthController = {
  getAuthDetails: (): Promise<StravaAuthProvider> => {
    return Promise.resolve(config.strava.authProvider);
  },

  // checks authentication
  isAuthenticated: (sessionId: string): Promise<SessionData | null> => {
    return getSessionData(sessionId);
  },

  // for initial account creation
  connectToStrava: async (authCode: string): Promise<string> => {
    console.log('connectToStrava called');

    const { access_token } = await getAuthToken(authCode);
    const athlete = await getAthlete(access_token);

    (athlete as any)._id = athlete.id;
    await insertAthlete(athlete);

    const sessionId = uuid.v4();
    await mapTokenToAthlete(athlete.id, access_token, sessionId);
    return sessionId;
  }
};

export default authController;