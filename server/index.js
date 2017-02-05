// python-> javascript re-write code goes here. This is your main 
import { insertActivities, insertAthlete, listAthleteActivities } from './mongoClient';
import { getAthlete, fullStravaActivities } from './serviceCalls';

async function grabData() {
    console.log('retrieving activities');
    let stravaActivities = await fullStravaActivities()
    stravaActivities = stravaActivities.map(activity => {
        activity._id = activity.id;
        return activity;
    });


    console.log('inserting activities');
    await insertActivities(stravaActivities);
    console.log('retrieving athlete');
    let athlete = await getAthlete();
    athlete._id = athlete.id;
    console.log('inserting athlete');
    await insertAthlete(athlete);
    console.log('done');
}

grabData();

listAthleteActivities(3231940)
    .then(a => {
        console.log(a.length);
    })