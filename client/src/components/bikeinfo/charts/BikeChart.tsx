import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { StravaActivity, StravaBike } from '../../../../../types/strava';
import { transformToRechartsData, getBikeColor } from './dataTransformers';
import { TimeRange } from './TimeRangeFilter';
import { useTheme } from '../../../context/ThemeContext';
import { getThemeColors } from '../../../styles/solarized';

interface ChartBuilder {
  id: string;
  label: string;
  description: (preference: boolean) => string;
  rowBuilder: (preference: boolean) => (activity: any, previousValue: number) => number;
}

interface BikeChartProps {
  activities: StravaActivity[];
  bikes: StravaBike[];
  selectedBikes: string[];
  chart: ChartBuilder;
  prefersMetric?: boolean;
  timeRange?: TimeRange;
}

const BikeChart = ({
  activities,
  bikes,
  selectedBikes,
  chart,
  prefersMetric = false,
  timeRange
}: BikeChartProps): React.ReactElement => {
  const { darkMode } = useTheme();
  const colors = getThemeColors(darkMode);

  // Transform data for Recharts
  const data = React.useMemo(() => {
    try {
      return transformToRechartsData(
        activities,
        bikes,
        chart.rowBuilder(prefersMetric),
        selectedBikes,
        timeRange
      );
    } catch (error) {
      console.error('Error transforming chart data:', error);
      return [];
    }
  }, [activities, bikes, selectedBikes, chart, prefersMetric, timeRange]);

  // Get active bikes (with distance > 0) that are selected
  const activeBikes = React.useMemo(() => {
    const filtered = bikes.filter(bike => bike.distance && bike.distance > 0);
    return selectedBikes.length > 0
      ? filtered.filter(bike => selectedBikes.includes(bike.id))
      : filtered;
  }, [bikes, selectedBikes]);

  const formatTooltipValue = (value: number) => {
    if (chart.id === 'distance') {
      return prefersMetric ? `${value.toFixed(1)} km` : `${value.toFixed(1)} mi`;
    }
    if (chart.id === 'elevation') {
      return prefersMetric ? `${Math.round(value)} m` : `${Math.round(value)} ft`;
    }
    if (chart.id === 'time') {
      return `${value.toFixed(1)} hours`;
    }
    if (chart.id === 'count') {
      return `${Math.round(value)} rides`;
    }
    return value.toString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div style={{
        backgroundColor: colors.cardBackground,
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        padding: '12px',
        boxShadow: colors.shadow
      }}>
        <p style={{
          color: colors.textPrimary,
          margin: '0 0 8px 0',
          fontWeight: '600'
        }}>
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{
            color: entry.color,
            margin: '4px 0',
            fontSize: '14px'
          }}>
            {entry.dataKey}: {formatTooltipValue(entry.value)}
          </p>
        ))}
      </div>
    );
  };

  if (data.length === 0) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: colors.textSecondary,
        fontSize: '16px'
      }}>
        {selectedBikes.length === 0 ? 'Select bikes to view chart' : 'No data available for selected bikes'}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={colors.border}
          opacity={0.3}
        />
        <XAxis
          dataKey="date"
          stroke={colors.textSecondary}
          fontSize={12}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }}
        />
        <YAxis
          stroke={colors.textSecondary}
          fontSize={12}
          tickFormatter={formatTooltipValue}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{
            color: colors.textPrimary,
            fontSize: '14px'
          }}
        />
        {activeBikes.map((bike) => (
          <Line
            key={bike.id}
            type="monotone"
            dataKey={bike.name}
            stroke={getBikeColor(bike.id, bikes)}
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 4,
              stroke: getBikeColor(bike.id, bikes),
              strokeWidth: 2,
              fill: colors.cardBackground
            }}
            connectNulls={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BikeChart;