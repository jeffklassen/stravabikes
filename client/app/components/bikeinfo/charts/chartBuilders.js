import { convertDistance, convertElevation, convertTime } from "./converters";
const chartBuilders = [
  {
    id: "distance",
    label: "Distance",
    description: function (preference) {
      if (preference == true) {
        return "in km";
      } else {
        return "in miles";
      }
    },
    rowBuilder: function (preference) {
      return function (activity, previousValue) {
        return convertDistance(preference, activity.distance) + previousValue;
      };
    },
  },
  {
    id: "elevation",
    label: "Elevation",
    description: function (preference) {
      if (preference) {
        return "in meters";
      } else {
        return "in feet";
      }
    },
    rowBuilder: function (preference) {
      return function (activity, previousValue) {
        return (
          convertElevation(preference, activity.total_elevation_gain) +
          previousValue
        );
      };
    },
  },
  {
    id: "time",
    label: "Time",
    description: function (preference) {
      return "in hours";
    },
    rowBuilder: function (preference) {
      return function (activity, previousValue) {
        return convertTime(preference, activity.moving_time) + previousValue;
      };
    },
  },
  {
    id: "count",
    label: "Count",
    description: function (preference) {
      return "# of rides";
    },
    rowBuilder: function () {
      return function (activity, previousValue) {
        return 1 + previousValue;
      };
    },
  },
];

export default chartBuilders;
