"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoclient_1 = require("../clients/mongoclient");
const stravaclient_1 = require("../clients/stravaclient");
// mapping database fields to front-end names
const fieldMapping = {
    distance: { display: 'Distance', fieldName: 'distance' },
    elevation: { display: 'Elevation', fieldName: 'total_elevation_gain' },
    time: { display: 'Time', fieldName: 'moving_time' }
};
const athleteController = {
    loadActivities: async (authId) => {
        const activities = await (0, stravaclient_1.fullStravaActivities)(authId);
        return (0, mongoclient_1.insertActivities)(activities);
    },
    getAthlete: (athleteId) => {
        return (0, mongoclient_1.getAthlete)(athleteId);
    },
    getActivities: (athleteId) => {
        return (0, mongoclient_1.listAthleteRides)(athleteId);
    },
    // pull athlete profile, grab sum of relevant summary fields (time, elevation, distance) by bike from DB
    getSummary: async (athleteId) => {
        const data = await Promise.all([
            (0, mongoclient_1.getAthlete)(athleteId),
            (0, mongoclient_1.rideAggregation)(athleteId, fieldMapping.distance.fieldName),
            (0, mongoclient_1.rideAggregation)(athleteId, fieldMapping.elevation.fieldName),
            (0, mongoclient_1.rideAggregation)(athleteId, fieldMapping.time.fieldName)
        ]);
        const athlete = data[0];
        // drill down to each bike/metric object and add bikeName field
        const modifiedAggregations = [data[1], data[2], data[3]]
            .map((aggregation) => {
            return aggregation
                // total up the metrics for all bikes
                .reduce((reducer, element) => {
                if (!reducer.total) {
                    reducer.total = 0;
                }
                reducer.total += element.total;
                // map the metric field name to front-end name
                if (!reducer.field) {
                    reducer.field = Object.keys(fieldMapping)
                        .reduce((nestedReducer, key) => {
                        if (fieldMapping[key].fieldName === element.field) {
                            nestedReducer = fieldMapping[key].display;
                        }
                        return nestedReducer;
                    }, '');
                }
                return reducer;
            }, {});
        });
        return { athlete, summary: modifiedAggregations };
    }
};
exports.default = athleteController;
//# sourceMappingURL=athleteController.js.map