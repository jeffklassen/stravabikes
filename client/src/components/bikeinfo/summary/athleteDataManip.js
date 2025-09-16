
function extractMetricPreference(athleteMetricPreference) {
    if (athleteMetricPreference === 'meters') {
        return true;
    } else {
        return false;
    }
}

function generateYLabel(metric) {
    if (metric == true) {
        return 'Distance (km)';
    } else {
        return 'Distance (miles)';
    }
}

function convertMetric(metric, unconvertedValue) {

    if (metric) {
        return unconvertedValue * .001;
    } else {
        return unconvertedValue * .000621371;
    }
}

function buildRows(activities, bikes, rowBuilder) {
    //console.log(typeof rowBuilder);
    if (!rowBuilder && typeof rowBuilder !== 'function') {
        throw 'rowBuilder must be a function';
    }
    if (!bikes) {
        throw 'bikes must not be null';
    }
    return activities.reduce((reducer, activity) => {
        let previousRow;
        if (reducer[reducer.length - 1]) {
            previousRow = reducer[reducer.length - 1];
        }

        //put bikeId for all bikes in list, then get the bike id's index for the specific activity
        let activityIndex = bikes.map(bike => bike.id).indexOf(activity.gear_id);

        //for every bike, take the bike and its index in bikes
        let data = bikes.map((bike, index) => {
            //get previous value at bike index
            let previousValue = 0;
            if (previousRow && previousRow[index + 1]) {
                previousValue = previousRow[index + 1];
            }

            //only update the correct bike sum if indexes match
            if (index === activityIndex) {
                return rowBuilder(activity, previousValue);
            }
            else {
                return previousValue;
            }
        });
        //add new row to reducer list
        reducer.push([new Date(activity.start_date_local), ...data]);
        return reducer;
    }, []);
}

function buildColumns(bikes) {
    console.log('bikes', bikes);
    if (!bikes) {
        throw 'bikes must not be null';
    }
    let columns = [{
        label: 'Date',
        type: 'date'
    }];
    columns = columns.concat(bikes.map(bike => {
        return { type: 'number', label: bike.name };
    }));
    return columns;
}

export { extractMetricPreference, convertMetric, buildRows, buildColumns, generateYLabel };