// python-> javascript re-write code goes here. This is your main 
import { insertActivities, insertAthlete, listAthleteActivities } from './mongoclient';
import { getAthlete, fullStravaActivities } from './stravaclient';

async function grabData() {
    console.log('retrieving activities');
    let stravaActivities = await fullStravaActivities();
    stravaActivities = stravaActivities.map(activity => {
        activity._id = activity.id;
        return activity;
    });

    //rewrite so that athlete call can happen concurrent to activities
    //create another asyn function. then call seperately

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
    .then(activities => {
        let ridesWithBikes = activities
            .filter(activity => activity.type === 'Ride')
            .filter(ride => typeof ride.gear_id === 'string');

        let bikeList = ridesWithBikes.reduce((bl, ride) => {
            if (!bl.includes(ride.gear_id)) {
                bl.push(ride.gear_id);
            }
            return bl;
        }, []);

       
        console.log(bikeList.length);
        return bikeList.length;
    });