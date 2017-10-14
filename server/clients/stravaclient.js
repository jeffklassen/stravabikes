import * as request from 'superagent';
import config from '../config/config';

const stravaAPIURL = 'https://www.strava.com/api/v3/';
async function getAuthToken(authCode) {

    let response = await request.post('https://www.strava.com/oauth/token')
        .send({
            client_id: config.strava.authProvider.clientId,
            client_secret: config.strava.clientSecret,
            code: authCode
        });

    console.log(response.body);
    return response.body;

}

async function fullStravaActivities(authId) {

    const stravaActivityUrl = stravaAPIURL + 'activities';
    const headers = { Authorization: `Bearer ${authId}` };

    let params = { per_page: 200 };
    let stravaActivities = [];
    let morePages = true;
    let pageCounter = 1;

    while (morePages) {
        params.page = pageCounter;
        try {
            let response = await request
                .get(stravaActivityUrl)
                .query(params)
                .set(headers);
            let activities = response.body;
            stravaActivities = stravaActivities.concat(activities);
            pageCounter++;
            console.log('page returned, got', activities.length);
            if (activities.length < params.per_page) {
                morePages = false;
            }
        } catch (err) {
            console.log(err);
            throw err;
        }

    }
    stravaActivities = stravaActivities.map(activity => {
        activity._id = activity.id;
        return activity;
    });
    return stravaActivities;

}

async function getAthlete(authId) {
    const stravaAthleteUrl = stravaAPIURL + 'athlete';
    const headers = { Authorization: `Bearer ${authId}` };

    let athlete;
    try {
        let response = await request
            .get(stravaAthleteUrl)
            .set(headers);

        console.log('RESPONSE')
        console.log(response);

        athlete = response.body;

    } catch (err) {
        throw err;
    }
    return athlete;
}



export { getAthlete, fullStravaActivities, getAuthToken };