import config from '../config/config';
import { getAuthToken, getAthlete, refreshToken, isTokenExpired } from '../clients/stravaclient';
import { mapTokenToAthlete, insertAthlete, getSessionData, updateSessionTokens } from '../clients/mongoclient';
import * as uuid from 'uuid';
import { StravaAuthProvider } from '../../../types/strava';
import { SessionData } from '../../../types/models';

interface AuthController {
  getAuthDetails: () => Promise<StravaAuthProvider>;
  isAuthenticated: (sessionId: string) => Promise<SessionData | null>;
  connectToStrava: (authCode: string) => Promise<string>;
  getValidAccessToken: (sessionId: string) => Promise<string | null>;
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

    const tokenResponse = await getAuthToken(authCode);
    const { access_token, refresh_token, expires_at } = tokenResponse;
    const athlete = await getAthlete(access_token);

    (athlete as any)._id = athlete.id;
    await insertAthlete(athlete);

    const sessionId = uuid.v4();
    await mapTokenToAthlete(athlete.id, access_token, sessionId, refresh_token, expires_at);
    return sessionId;
  },

  // gets a valid access token, refreshing if needed
  getValidAccessToken: async (sessionId: string): Promise<string | null> => {
    const sessionData = await getSessionData(sessionId);
    if (!sessionData) {
      return null;
    }

    // Check if token is expired and needs refresh
    if (sessionData.expiresAt && isTokenExpired(sessionData.expiresAt)) {
      if (!sessionData.refreshToken) {
        console.log('Token expired and no refresh token available');
        return null;
      }

      try {
        console.log('Token expired, refreshing...');
        const newTokenData = await refreshToken(sessionData.refreshToken);
        const { access_token, refresh_token, expires_at } = newTokenData;

        // Update session with new tokens
        await updateSessionTokens(sessionId, access_token, refresh_token, expires_at);
        console.log('Token refreshed successfully');
        return access_token;
      } catch (error) {
        console.log('Token refresh failed:', error);
        return null;
      }
    }

    return sessionData.accessToken;
  }
};

export default authController;