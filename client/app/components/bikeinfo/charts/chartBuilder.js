
const chartBuilder = {
    distance: {
        id: 'distance',
        label: 'Bike Mileage',
        rowBuilder: (activity, previousValue, converter) => {

            return converter(activity.distance) + previousValue;
        }
    },
    elevation: {
        id: 'elevation',
        label: 'Elevation',
        rowBuilder: (activity, previousValue, converter) => {

            return converter( activity.total_elevation_gain) + previousValue;
        }
    },
    time: {
        id: 'time',
        label: 'Time',
        rowBuilder: (activity, previousValue, converter) => {
            return converter( activity.moving_time) + previousValue;
        }
    },
    total: {
        id: 'total',
        label: 'Count',
        rowBuilder: (activity, previousValue) => {
          
            return 1 + previousValue;
        }
    }
};

export default chartBuilder;