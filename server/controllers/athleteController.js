import { fullStravaActivities } from "../clients/stravaclient.js";

//mapping database fields to front-end names
const fieldMapping = {
  distance: { display: "Distance", fieldName: "distance" },
  elevation: { display: "Elevation", fieldName: "total_elevation_gain" },
  time: { display: "Time", fieldName: "moving_time" },
};

const athleteController = {
  loadActivities: async (authId) => {
    let activities = await fullStravaActivities(authId);

    // return insertActivities(activities);
    return null;
  },
  getAthlete: (athleteId) => {
    // return getAthlete(athleteId);
    return null;
  },
  getActivities: (athleteId) => {
    // return listAthleteRides(athleteId);
    return null;
  },
  //pull athlete profile, grab sum of relevant summary fields (time, elevation, distance) by bike from DB
  getSummary: async (athleteId) => {
    // let data = await Promise.all([
    //   getAthlete(athleteId),
    //   rideAggregation(athleteId, fieldMapping.distance.fieldName),
    //   rideAggregation(athleteId, fieldMapping.elevation.fieldName),
    //   rideAggregation(athleteId, fieldMapping.time.fieldName),
    // ]);

    // let athlete = data[0];

    // //drill down to each bike/metric object and add bikeName field
    // let modifiedaggregations = [data[1], data[2], data[3]].map(
    //   (aggregation) => {
    //     return (
    //       aggregation

    //         //total up the metrics for all bikes
    //         .reduce((reducer, element) => {
    //           if (!reducer.total) {
    //             reducer.total = 0;
    //           }
    //           reducer.total += element.total;

    //           //map the metric field name to front-end name
    //           if (!reducer.field) {
    //             reducer.field = Object.keys(fieldMapping).reduce(
    //               (nestedReducer, key) => {
    //                 if (fieldMapping[key].fieldName == element.field) {
    //                   nestedReducer = fieldMapping[key].display;
    //                 }
    //                 return nestedReducer;
    //               },
    //               ""
    //             );
    //           }

    //           return reducer;
    //         }, {})
    //     );
    //   }
    // );
    // return { athlete, summary: modifiedaggregations };
    return null;
  },
};

export default athleteController;
