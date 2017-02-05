// python-> javascript re-write code goes here. This is your main 
import { insertActivities, insertAthlete, listAthleteActivities } from './mongoClient';
import { getAthlete, fullStravaActivities } from './serviceCalls';
/*
Promise.all([
    fullStravaActivities()
        .then(allStravaActivities => {
            return insertActivities(allStravaActivities);
        }),
    getAthlete()
        .then(athelete => {
            console.log(athelete);
            return insertAthlete(athelete);
        })
])
    .then(({allActivities, athlete}) => {
        console.log(allActivities, athlete);
    })
    .catch(console.log); 
*/
async function grabData() {
    let stravaActivities = await fullStravaActivities()
        .map(activity => {
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