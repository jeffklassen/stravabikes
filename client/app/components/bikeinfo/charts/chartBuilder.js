import { convertDistance, convertElevation, convertTime } from './converters';
const chartBuilder = {
    distance: {
        id: 'distance',
        label: 'Bike Mileage',
        rowBuilder: function (preference) {
            return function (activity, previousValue) {

                return convertDistance(preference, activity.distance) + previousValue;
            };
        }
    },
    elevation: {
        id: 'elevation',
        label: 'Elevation',
        rowBuilder: function (preference) {
            return function (activity, previousValue) {

                return convertElevation(preference, activity.total_elevation_gain) + previousValue;
            };
        }
    },
    time: {
        id: 'time',
        label: 'Time',
        rowBuilder: function (preference) {
            return function (activity, previousValue) {
                return convertTime(preference, activity.moving_time) + previousValue;
            };
        }
    },
    total: {
        id: 'total',
        label: 'Count',
        rowBuilder: function () {

            return function (activity, previousValue) {
                return 1 + previousValue;
            };
        }
    }
};

export default chartBuilder;