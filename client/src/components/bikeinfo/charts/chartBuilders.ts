import { convertDistance, convertElevation, convertTime } from './converters';
import { ActivityDocument } from '../../../../../types/models';

interface ChartBuilder {
  id: string;
  label: string;
  description: (preference: boolean) => string;
  rowBuilder: (preference: boolean) => (activity: ActivityDocument, previousValue: number) => number;
}

const chartBuilders: ChartBuilder[] = [
  {
    id: 'distance',
    label: 'Distance',
    description: function (preference: boolean): string {
      if (preference === true) {
        return 'in km';
      } else {
        return 'in miles';
      }
    },
    rowBuilder: function (preference: boolean) {
      return function (activity: ActivityDocument, previousValue: number): number {
        return convertDistance(preference, activity.distance) + previousValue;
      };
    }
  },
  {
    id: 'elevation',
    label: 'Elevation',
    description: function (preference: boolean): string {
      if (preference) {
        return 'in meters';
      } else {
        return 'in feet';
      }
    },
    rowBuilder: function (preference: boolean) {
      return function (activity: ActivityDocument, previousValue: number): number {
        return convertElevation(preference, activity.total_elevation_gain) + previousValue;
      };
    }
  },
  {
    id: 'time',
    label: 'Time',
    description: function (preference: boolean): string {
      return 'in hours';
    },
    rowBuilder: function (preference: boolean) {
      return function (activity: ActivityDocument, previousValue: number): number {
        return convertTime(preference, activity.moving_time) + previousValue;
      };
    }
  },
  {
    id: 'count',
    label: 'Count',
    description: function (preference: boolean): string {
      return '# of rides';
    },
    rowBuilder: function (preference: boolean) {
      return function (activity: ActivityDocument, previousValue: number): number {
        return 1 + previousValue;
      };
    }
  }
];

export default chartBuilders;