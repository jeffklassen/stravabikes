// python-> javascript re-write code goes here. This is your main
import { insertActivities, insertAthlete, listAthleteActivities, rideAggregation } from './mongoclient';
import { getAthlete, fullStravaActivities } from './stravaclient';
import { StravaActivity, StravaAthlete } from '../../types/strava';

async function grabData(): Promise<void> {
  console.log('retrieving activities');
  let stravaActivities: StravaActivity[] = await fullStravaActivities('');
  stravaActivities = stravaActivities.map((activity: StravaActivity) => {
    activity._id = activity.id;
    return activity;
  });

  //rewrite so that athlete call can happen concurrent to activities
  //create another asyn function. then call seperately

  console.log('inserting activities');
  await insertActivities(stravaActivities);
  console.log('retrieving athlete');

  const athlete: StravaAthlete = await getAthlete('');
  (athlete as any)._id = athlete.id;
  console.log('inserting athlete');
  await insertAthlete(athlete);
  console.log('done');
}

//grabData();

listAthleteActivities(3231940).then(console.log);

rideAggregation(3231940, 'distance')
  .then(res => res.map(m => console.log(m._id, m.total / 1609.344)))
  .catch(console.log);