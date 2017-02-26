import config from '../config/config';
import { getAuthToken } from '../clients/stravaclient';
import { mapTokenToAthlete, insertAthlete, getSessionData } from '../clients/mongoclient';
import uuid from 'uuid/v4';

const authController = {
    getClientId: () => {
        return Promise.resolve(config.clientId);
    },
    authenticate: () => {

    },

    connectToStrava: (authCode) => {

        return getAuthToken(authCode)
            .then(({access_token, athlete}) => {
                athlete._id = athlete.id;

                return insertAthlete(athlete)
                    .then(() => {
                        return {
                            athleteId: athlete.id,
                            accessToken: access_token
                        };
                    });
                /*return Promise.all([
                  let sessionId = uuid();
                    insertAthlete(athlete),
                    mapTokenToAthlete(athlete.id, access_token, sessionId)

                ])
                   ;*/
            });
    },
    getSessionData: (sessionId) => {
        return getSessionData(sessionId);
    }

};

export default authController;