import { getAthlete, getAuthToken } from "../clients/stravaclient";
import {
  getSessionData,
  insertAthlete,
  mapTokenToAthlete,
} from "../clients/mongoclient";

import config from "../config/config";
import uuid from "uuid/v4";

const authController = {
  getAuthDetails: () => {
    return Promise.resolve(config.strava.authProvider);
  },

  //checks authentication
  isAuthenticated: (sessionId) => {
    return getSessionData(sessionId);
  },
  // for initial account creation
  connectToStrava: async (authCode) => {
    console.log("connectToStrava called");

    let { access_token } = await getAuthToken(authCode);

    let athlete = await getAthlete(access_token);

    athlete._id = athlete.id;

    await insertAthlete(athlete);

    let sessionId = uuid();
    await mapTokenToAthlete(athlete.id, access_token, sessionId);
    return sessionId;
  },
};

export default authController;
