import * as request from 'superagent';
import config from '../config/config';

const stravaAPIURL = 'https://www.strava.com/api/v3/';
//const authId = '3db92dcc937476ff0a68ab3cc6c1c47f4bd988e6';
async function getAuthToken(authCode) {
    return request.post('https://www.strava.com/oauth/token')
        .send({
            client_id: config.clientId,
            client_secret: config.clientSecret,
            code: authCode
        })
        .then(response => {
            return response.body;
        });
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
            console.log('page returned, got', activities.length)
            if (activities.length < params.per_page) {
                morePages = false;
            }
        } catch (err) {
            console.log(err);
            throw err;
        }

    }
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

        athlete = response.body;

    } catch (err) {
        throw err;
    }
    return athlete;
}

/*fullStravaActivities()
    .then(function (allStravaActivities) {
        console.log(allStravaActivities.length);
        return allStravaActivities;
    });


getAthlete()
    .then(function (athelete) {
        console.log(athelete);
    });
*/

export { getAthlete, fullStravaActivities, getAuthToken };