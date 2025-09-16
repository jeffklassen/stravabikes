"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// python-> javascript re-write code goes here. This is your main
const mongoclient_1 = require("./mongoclient");
const stravaclient_1 = require("./stravaclient");
async function grabData() {
    console.log('retrieving activities');
    let stravaActivities = await (0, stravaclient_1.fullStravaActivities)('');
    stravaActivities = stravaActivities.map((activity) => {
        activity._id = activity.id;
        return activity;
    });
    //rewrite so that athlete call can happen concurrent to activities
    //create another asyn function. then call seperately
    console.log('inserting activities');
    await (0, mongoclient_1.insertActivities)(stravaActivities);
    console.log('retrieving athlete');
    const athlete = await (0, stravaclient_1.getAthlete)('');
    athlete._id = athlete.id;
    console.log('inserting athlete');
    await (0, mongoclient_1.insertAthlete)(athlete);
    console.log('done');
}
//grabData();
(0, mongoclient_1.listAthleteActivities)(3231940).then(console.log);
(0, mongoclient_1.rideAggregation)(3231940, 'distance')
    .then(res => res.map(m => console.log(m._id, m.total / 1609.344)))
    .catch(console.log);
//# sourceMappingURL=index.js.map