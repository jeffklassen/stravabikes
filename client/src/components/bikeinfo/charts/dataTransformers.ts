import { ActivityDocument } from '../../../../../types/models';
import { StravaActivity, StravaBike } from '../../../../../types/strava';
import { TimeRange } from './TimeRangeFilter';

interface Bike {
  id: string;
  name: string;
}

type RowBuilder = (activity: ActivityDocument, previousValue: number) => number;

interface ChartDataPoint {
  date: string;
  timestamp: number;
  [bikeName: string]: number | string;
}

// Transform the old rows/columns format to Recharts format
export function transformToRechartsData(
  activities: StravaActivity[],
  bikes: StravaBike[],
  rowBuilder: RowBuilder,
  selectedBikes: string[] = [],
  timeRange?: TimeRange
): ChartDataPoint[] {
  if (!rowBuilder || typeof rowBuilder !== 'function') {
    throw new Error('rowBuilder must be a function');
  }
  if (!bikes) {
    throw new Error('bikes must not be null');
  }

  // Filter bikes to only active ones (with distance > 0) and selected ones
  const activeBikes = bikes.filter(bike => bike.distance && bike.distance > 0);
  const filteredBikes = selectedBikes.length > 0
    ? activeBikes.filter(bike => selectedBikes.includes(bike.id))
    : activeBikes;

  if (filteredBikes.length === 0) {
    return [];
  }

  // Filter activities by time range
  const filteredActivities = timeRange && timeRange.days
    ? activities.filter(activity => {
        const activityDate = new Date(activity.start_date_local);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - timeRange.days);
        return activityDate >= cutoffDate;
      })
    : activities;

  // Convert to the format expected by existing functions
  const bikeMap: Bike[] = filteredBikes.map(bike => ({ id: bike.id, name: bike.name }));

  return filteredActivities.reduce((data: ChartDataPoint[], activity: StravaActivity) => {
    let previousData: ChartDataPoint | undefined;
    if (data.length > 0) {
      previousData = data[data.length - 1];
    }

    // Find which bike this activity belongs to
    const activityBikeIndex = bikeMap.findIndex(bike => bike.id === activity.gear_id);

    // Create new data point
    const dataPoint: ChartDataPoint = {
      date: new Date(activity.start_date_local).toLocaleDateString(),
      timestamp: new Date(activity.start_date_local).getTime()
    };

    // Calculate values for each bike
    bikeMap.forEach((bike, index) => {
      let previousValue = 0;
      if (previousData && typeof previousData[bike.name] === 'number') {
        previousValue = previousData[bike.name] as number;
      }

      // Only update the value for the bike that did this activity
      if (index === activityBikeIndex) {
        dataPoint[bike.name] = rowBuilder(activity as any, previousValue);
      } else {
        dataPoint[bike.name] = previousValue;
      }
    });

    data.push(dataPoint);
    return data;
  }, []);
}

// Generate colors for bikes (same as BikeSelector)
export function getBikeColor(bikeId: string, bikes: StravaBike[]): string {
  const colors = [
    '#fc4c02', // Strava orange
    '#2563eb', // Blue
    '#dc2626', // Red
    '#059669', // Green
    '#7c3aed', // Purple
    '#ea580c', // Orange
    '#0891b2', // Cyan
    '#be123c', // Rose
    '#15803d', // Emerald
    '#9333ea'  // Violet
  ];

  const index = bikes.findIndex(bike => bike.id === bikeId);
  return colors[index % colors.length];
}