import { convertDistance, convertElevation, convertTime } from './converters';
const chartBuilders = [
    {
        id: 'distance',
        label: 'Mileage',
        rowBuilder: function (preference) {
            return function (activity, previousValue) {

                return convertDistance(preference, activity.distance) + previousValue;
            };
        }
    },
    {
        id: 'elevation',
        label: 'Elevation',
        rowBuilder: function (preference) {
            return function (activity, previousValue) {

                return convertElevation(preference, activity.total_elevation_gain) + previousValue;
            };
        }
    },
    {
        id: 'time',
        label: 'Time',
        rowBuilder: function (preference) {
            return function (activity, previousValue) {
                return convertTime(preference, activity.moving_time) + previousValue;
            };
        }
    },
    {
        id: 'count',
        label: 'Count',
        rowBuilder: function () {

            return function (activity, previousValue) {
                return 1 + previousValue;
            };
        }
    }
];

export default chartBuilders;