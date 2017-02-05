// python-> javascript re-write code goes here. This is your main 
import { insertActivities, insertAthlete, listAthleteActivities } from './mongoClient';
import { getAthlete, fullStravaActivities } from './serviceCalls';

async function grabData() {
    let stravaActivities = await fullStravaActivities()
    stravaActivities = stravaActivities.map(activity => {
        activity._id = activity.id;
        return activity;
    });

    let athlete = await getAthlete();
    athlete._id = athlete.id;
    await insertActivities(stravaActivities);
    await insertAthlete(athlete);
}

grabData();

listAthleteActivities(3231940)
    .then(a => {
        console.log(a.length);
    })