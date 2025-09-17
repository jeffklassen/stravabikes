import { ActivityDocument } from '../../../../../types/models';

interface Bike {
  id: string;
  name: string;
}

interface Column {
  label: string;
  type: 'date' | 'number';
}

type RowBuilder = (activity: ActivityDocument, previousValue: number) => number;

function extractMetricPreference(athleteMetricPreference: string): boolean {
  if (athleteMetricPreference === 'meters') {
    return true;
  } else {
    return false;
  }
}

function generateYLabel(metric: boolean): string {
  if (metric === true) {
    return 'Distance (km)';
  } else {
    return 'Distance (miles)';
  }
}

function convertMetric(metric: boolean, unconvertedValue: number): number {
  if (metric) {
    return unconvertedValue * 0.001; // meters to kilometers
  } else {
    return unconvertedValue * 0.000621371; // meters to miles
  }
}

function buildRows(activities: ActivityDocument[], bikes: Bike[], rowBuilder: RowBuilder): (Date | number)[][] {
  if (!rowBuilder || typeof rowBuilder !== 'function') {
    throw new Error('rowBuilder must be a function');
  }
  if (!bikes) {
    throw new Error('bikes must not be null');
  }

  return activities.reduce((reducer: (Date | number)[][], activity: ActivityDocument) => {
    let previousRow: (Date | number)[] | undefined;
    if (reducer[reducer.length - 1]) {
      previousRow = reducer[reducer.length - 1];
    }

    // put bikeId for all bikes in list, then get the bike id's index for the specific activity
    const activityIndex = bikes.map(bike => bike.id).indexOf(activity.gear_id || '');

    // for every bike, take the bike and its index in bikes
    const data = bikes.map((bike: Bike, index: number): number => {
      // get previous value at bike index
      let previousValue = 0;
      if (previousRow && typeof previousRow[index + 1] === 'number') {
        previousValue = previousRow[index + 1] as number;
      }

      // only update the correct bike sum if indexes match
      if (index === activityIndex) {
        return rowBuilder(activity, previousValue);
      } else {
        return previousValue;
      }
    });

    // add new row to reducer list
    reducer.push([new Date(activity.start_date_local), ...data]);
    return reducer;
  }, []);
}

function buildColumns(bikes: Bike[]): Column[] {
  if (!bikes) {
    throw new Error('bikes must not be null');
  }

  let columns: Column[] = [{
    label: 'Date',
    type: 'date'
  }];

  columns = columns.concat(bikes.map((bike: Bike): Column => {
    return { type: 'number', label: bike.name };
  }));

  return columns;
}

export {
  extractMetricPreference,
  convertMetric,
  buildRows,
  buildColumns,
  generateYLabel,
  type Bike,
  type Column,
  type RowBuilder
};