import React, { CSSProperties } from 'react';
import { formatDuration, intervalToDuration } from 'date-fns';
import { getThemeColors } from '../../../styles/solarized';

interface Summary {
  field: string;
  total: number;
}

interface ConvertedValue {
  label: string;
  value: string;
  unit?: string;
  subtitle?: string;
}

interface StatsCardProps {
  summary: Summary;
  metricPreference: string;
  darkMode?: boolean;
}

const StatsCard = ({ summary, metricPreference, darkMode = false }: StatsCardProps): React.ReactElement => {
  const convertedValue = conversionPasser(summary, metricPreference);
  const colors = getThemeColors(darkMode);

  const cardStyle: CSSProperties = {
    backgroundColor: colors.cardBackground,
    border: `1px solid ${colors.border}`,
    borderRadius: '12px',
    padding: '24px',
    margin: '0 12px 24px 0',
    minWidth: '200px',
    boxShadow: colors.shadow,
    transition: 'all 0.2s ease-in-out',
    cursor: 'default',
    display: 'inline-block',
    verticalAlign: 'top'
  };

  const valueStyle: CSSProperties = {
    fontSize: '32px',
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: '1.2',
    marginBottom: '4px'
  };

  const unitStyle: CSSProperties = {
    fontSize: '18px',
    fontWeight: '500',
    color: colors.accent,
    marginLeft: '4px'
  };

  const labelStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px'
  };

  const subtitleStyle: CSSProperties = {
    fontSize: '12px',
    color: colors.textMuted,
    fontWeight: '400'
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = colors.shadowHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = colors.shadow;
      }}
    >
      <div style={labelStyle}>{convertedValue.label}</div>
      <div style={valueStyle}>
        {convertedValue.value}
        {convertedValue.unit && <span style={unitStyle}>{convertedValue.unit}</span>}
      </div>
      {convertedValue.subtitle && <div style={subtitleStyle}>{convertedValue.subtitle}</div>}
    </div>
  );
};

// determines the summary type for conversion, passes to appropriate conversion function
function conversionPasser(summary: Summary, metricPreference: string): ConvertedValue {
  if (summary.field === 'Time') {
    return timeConverter(summary.total);
  } else if (summary.field === 'Elevation') {
    return elevationConverter(summary.total, metricPreference);
  } else if (summary.field === 'Distance') {
    return distanceConverter(summary.total, metricPreference);
  }

  return { label: 'Unknown', value: '0' };
}

// convert time in seconds to human readable time
function timeConverter(timeInSeconds: number): ConvertedValue {
  const duration = intervalToDuration({ start: 0, end: timeInSeconds * 1000 });

  // Create a more concise format
  const parts = [];
  if (duration.years) parts.push(`${duration.years}y`);
  if (duration.months) parts.push(`${duration.months}mo`);
  if (duration.days) parts.push(`${duration.days}d`);
  if (duration.hours) parts.push(`${duration.hours}h`);
  if (duration.minutes && parts.length < 3) parts.push(`${duration.minutes}m`);

  const mainValue = parts.slice(0, 2).join(' ') || '0m';
  const subtitle = parts.length > 2 ? `+ ${parts.slice(2).join(' ')}` : undefined;

  return {
    label: 'Time on Bike',
    value: mainValue,
    subtitle
  };
}

// convert distance in meters to either miles/km based on user preference
function distanceConverter(distanceInMeters: number, metricPreference: string): ConvertedValue {
  if (metricPreference === 'feet') {
    const miles = distanceInMeters * 0.000621371;
    const value = miles >= 1000
      ? (miles / 1000).toFixed(1) + 'k'
      : addCommas(Math.round(miles));

    return {
      label: 'Total Distance',
      value,
      unit: 'mi',
      subtitle: `${Math.round(miles / 12)} mi/month avg`
    };
  } else {
    const km = distanceInMeters * 0.001;
    const value = km >= 1000
      ? (km / 1000).toFixed(1) + 'k'
      : addCommas(Math.round(km));

    return {
      label: 'Total Distance',
      value,
      unit: 'km',
      subtitle: `${Math.round(km / 12)} km/month avg`
    };
  }
}

// convert elevation gain to feet/meters based on user preference
function elevationConverter(elevationinMeters: number, metricPreference: string): ConvertedValue {
  if (metricPreference === 'feet') {
    const feet = elevationinMeters * 3.28084;
    const value = feet >= 1000000
      ? (feet / 1000000).toFixed(1) + 'M'
      : feet >= 1000
        ? (feet / 1000).toFixed(0) + 'k'
        : addCommas(Math.round(feet));

    return {
      label: 'Total Climbing',
      value,
      unit: 'ft',
      subtitle: `${Math.round(feet / 12)} ft/month avg`
    };
  } else {
    const meters = elevationinMeters;
    const value = meters >= 1000000
      ? (meters / 1000000).toFixed(1) + 'M'
      : meters >= 1000
        ? (meters / 1000).toFixed(0) + 'k'
        : addCommas(Math.round(meters));

    return {
      label: 'Total Climbing',
      value,
      unit: 'm',
      subtitle: `${Math.round(meters / 12)} m/month avg`
    };
  }
}

// adds commas to numbers for readability
function addCommas(intNum: number): string {
  return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
}

export default StatsCard;