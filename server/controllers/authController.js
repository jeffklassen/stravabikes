import { config } from "../config/config.js";
import { getAuthToken } from "../clients/stravaclient.js";
import sequelize from "../clients/sqlite.js";
import { v4 as uuid } from "uuid";

const { Athlete } = sequelize.models;

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

    let { access_token, athlete } = await getAuthToken(authCode);

    athlete._id = athlete.id;

    console.log("athlete", athlete);
    console.log("access_token", access_token);

    const createdAthlete = await Athlete.create(athlete);

    console.log(createdAthlete);

    let sessionId = uuid();
    // await mapTokenToAthlete(athlete.id, access_token, sessionId);
    return sessionId;
  },
};

export default authController;
