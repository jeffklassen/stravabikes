import { getAthlete, rideAggregation, listAthleteRides } from '../clients/mongoclient';

//match bikeId in activities to bikeName in athlete profile
const mapBikeIdToBike = (athlete, element) => {
    let name;
    let correctBike = athlete.bikes.reduce(b => {
        return b.id == element._id;
    });
    if (correctBike.length == 1) {
        name = correctBike[0].name;
    }

    element.name = name;
    return element;
};

//mapping database fields to front-end names
const fieldMapping = {
    distance: { display: 'Distance', fieldName: 'distance' },
    elevation: { display: 'Elevation', fieldName: 'total_elevation_gain' },
    time: { display: 'Time', fieldName: 'moving_time' }
};


const athleteController = {
    getAthlete: () => {
        return getAthlete(3231940);
    },
    getActivities: () => {
        return listAthleteRides(3231940);
    },
    //pull athlete profile, grab sum of relevant summary fields (time, elevation, distance) by bike from DB
    getSummary: () => {
        return Promise.all([
            getAthlete(3231940),
            rideAggregation(3231940, fieldMapping.distance.fieldName),
            rideAggregation(3231940, fieldMapping.elevation.fieldName),
            rideAggregation(3231940, fieldMapping.time.fieldName)
        ])

            .then(data => {
                let athlete = data[0];

                //drill down to each bike/metric object and add bikeName field
                let modifiedaggregations = [data[1], data[2], data[3]]
                    .map(aggregation => {
                        return aggregation
                            .map(element => {
                                element = mapBikeIdToBike(athlete, element);
                                return element;
                            })
                            //total up the metrics for all bikes
                            .reduce((reducer, element) => {
                                if (!reducer.total) {
                                    reducer.total = 0;
                                }
                                reducer.total += element.total;
                                
                                //map the metric field name to front-end name
                                if (!reducer.field) {
                                    reducer.field = Object.keys(fieldMapping)
                                        .reduce((nestedReducer, key) => {
                                            if (fieldMapping[key].fieldName == element.field) {
                                                nestedReducer = fieldMapping[key].display;
                                            }
                                            return nestedReducer;
                                        }, '');
                                }


                                return reducer;
                            }, {});
                    });
                return { athlete, summary: modifiedaggregations };
            });
    }

};

export default athleteController;

