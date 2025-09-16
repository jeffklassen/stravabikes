import * as request from 'superagent';
import { StravaAuthProvider } from '../../../types/strava';

interface LoginResponse {
  loggedIn: boolean;
}

interface AuthDetailsResponse {
  body: StravaAuthProvider;
}

interface AuthenticationResponse {
  body: {
    loggedIn: boolean;
  };
}

interface AuthService {
  completeLoginWithStrava: (authCode: string) => Promise<request.Response>;
  getStravaAuthDetails: () => Promise<AuthDetailsResponse>;
  isAuthenticated: () => Promise<AuthenticationResponse>;
}

const authService: AuthService = {
  completeLoginWithStrava: (authCode: string): Promise<request.Response> => {
    return request.post('/api/connectToStrava')
      .send({ authCode });
  },

  getStravaAuthDetails: (): Promise<AuthDetailsResponse> => {
    return request.get('/api/authDetails');
  },

  isAuthenticated: (): Promise<AuthenticationResponse> => {
    return request.get('/api/isAuthenticated');
  }
};

export default authService;