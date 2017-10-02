import config from '../config/config';
import { getAuthToken } from '../clients/stravaclient';
import { mapTokenToAthlete, insertAthlete, getSessionData } from '../clients/mongoclient';
import uuid from 'uuid/v4';

const authController = {
    getAuthDetails: () => {
        return Promise.resolve(config.strava.authProvider);
    },

    //checks authentication
    isAuthenticated: (sessionId) => {
        return getSessionData(sessionId);
    },
    // for initial account creation
    connectToStrava: (authCode) => {

        return getAuthToken(authCode)
            .then(({ access_token, athlete }) => {
                athlete._id = athlete.id;

                return insertAthlete(athlete)
                    .then(() => {
                        return {
                            athleteId: athlete.id,
                            accessToken: access_token
                        };
                    });

            })
            // create the session and return the session id
            .then(({ athleteId, accessToken }) => {
                let sessionId = uuid();
                return mapTokenToAthlete(athleteId, accessToken, sessionId)
                    .then(() => sessionId);
            });
    },


};

export default authController;