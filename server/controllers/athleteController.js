import { getAthlete, rideAggregation } from '../clients/mongoclient';

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

const fieldMapping = {
    distance: { display: 'Distance', fieldName: 'distance' },
    elevation: { display: 'Elevation Gain', fieldName: 'total_elevation_gain' },
    time: { display: 'Time', fieldName: 'moving_time' }
};

const athleteController = {
    getAthlete: () => {
        return getAthlete(3231940);
    },
    getSummary: () => {
        return Promise.all([
            getAthlete(3231940),
            rideAggregation(3231940, fieldMapping.distance.fieldName),
            rideAggregation(3231940, fieldMapping.elevation.fieldName),
            rideAggregation(3231940, fieldMapping.time.fieldName)
        ])

            .then(data => {
                let athlete = data[0];

                let modifiedaggregations = [data[1], data[2], data[3]]
                    .map(aggregation => {
                        return aggregation
                            .map(element => {
                                element = mapBikeIdToBike(athlete, element);
                                return element;
                            })
                            .reduce((reducer, element) => {
                                if (!reducer.total) {
                                    reducer.total = 0;
                                }
                                reducer.total += element.total;
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

