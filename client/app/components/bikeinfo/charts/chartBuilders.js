import { convertDistance, convertElevation, convertTime } from './converters';
const chartBuilders = [
    {
        id: 'distance',
        label: 'Miles Ridden',
        rowBuilder: function (preference) {
            return function (activity, previousValue) {

                return convertDistance(preference, activity.distance) + previousValue;
            };
        }
    },
    {
        id: 'elevation',
        label: 'Elevation Gain',
        rowBuilder: function (preference) {
            return function (activity, previousValue) {

                return convertElevation(preference, activity.total_elevation_gain) + previousValue;
            };
        }
    },
    {
        id: 'time',
        label: 'Time Riding',
        rowBuilder: function (preference) {
            return function (activity, previousValue) {
                return convertTime(preference, activity.moving_time) + previousValue;
            };
        }
    },
    {
        id: 'count',
        label: 'Ride Count',
        rowBuilder: function () {

            return function (activity, previousValue) {
                return 1 + previousValue;
            };
        }
    }
];

export default chartBuilders;