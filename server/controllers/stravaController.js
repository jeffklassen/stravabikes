import {
  authenticateAndRetrieveAthlete,
  fullStravaActivities,
} from "../clients/stravaclient.js";

import { config } from "../config/config.js";
import sequelize from "../clients/sqlite.js";
import { v4 as uuid } from "uuid";

const { Athlete, Activity, Session } = sequelize.models;

const stravaController = {
  getAuthDetails: () => {
    console.log("called, returning", config.strava.authProvider);
    return Promise.resolve(config.strava.authProvider);
  },

  //checks authentication
  isAuthenticated: async (sessionId) => {
    const session = await Session.findByPk(sessionId);
    return session.id;
  },

  // for initial account creation
  connectToStravaAndGetData: async (authCode) => {
    console.log("connectToStrava called");

    let { access_token, athlete } = await authenticateAndRetrieveAthlete(
      authCode
    );

    console.log("athlete", athlete);
    console.log("access_token", access_token);

    await Athlete.create(athlete);

    const activities = await fullStravaActivities(access_token);

    await Activity.bulkCreate(
      activities.map((activity) => {
        activity.athleteId = activity.athlete.id;
        return activity;
      })
    );

    let sessionId = uuid();
    await Session.create({
      id: sessionId,
      access_token,
      athleteId: athlete.id,
    });
    // await mapTokenToAthlete(athlete.id, access_token, sessionId);
    return sessionId;
  },
};

export default stravaController;
