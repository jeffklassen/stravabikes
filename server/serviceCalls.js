import * as request from 'superagent';

const stravaAPIURL = 'https://www.strava.com/api/v3/';
const authId = '3db92dcc937476ff0a68ab3cc6c1c47f4bd988e6';
async function fullStravaActivities() {


    const stravaActivityUrl = stravaAPIURL + 'activities';
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

async function getAthlete() {
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

//check if the athlete exists in the DB
//if no, create athlete, if yes, rewrite athlete record
async function checkAthlete(){
}


//If an athlete already exists in the DB, want to query Strava for
//any new activities 
async function updateActivities() {
    //some sort of compare b/w DB records and Strava records

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

export { getAthlete, fullStravaActivities };