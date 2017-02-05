import * as request from 'superagent';

async function fullStravaActivities(authId) {


    const stravaActivityUrl = 'https://www.strava.com/api/v3/athlete/activities';
    authId = '3db92dcc937476ff0a68ab3cc6c1c47f4bd988e6';

    const headers = { Authorization: `Bearer ${authId}` };

    let params = { per_page: 25 };
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

fullStravaActivities()
    .then(function (allStravaActivities) {
        console.log(allStravaActivities.length);
        return allStravaActivities;
    })
    