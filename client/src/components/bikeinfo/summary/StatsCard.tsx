import React, { CSSProperties } from 'react';
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
  monthsActive?: number;
  darkMode?: boolean;
}

const StatsCard = ({ summary, metricPreference, monthsActive, darkMode = false }: StatsCardProps): React.ReactElement => {
  const convertedValue = conversionPasser(summary, metricPreference, monthsActive);
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
function conversionPasser(summary: Summary, metricPreference: string, monthsActive?: number): ConvertedValue {
  if (summary.field === 'Time') {
    return timeConverter(summary.total, monthsActive);
  } else if (summary.field === 'Elevation') {
    return elevationConverter(summary.total, metricPreference, monthsActive);
  } else if (summary.field === 'Distance') {
    return distanceConverter(summary.total, metricPreference, monthsActive);
  }

  return { label: 'Unknown', value: '0' };
}

// "123 mi/month avg", or undefined when we don't know how long the athlete has been riding
function monthlyAverage(total: number, unit: string, monthsActive?: number): string | undefined {
  if (!monthsActive) return undefined;
  return `${addCommas(Math.round(total / monthsActive))} ${unit}/month avg`;
}

// abbreviate large numbers: 1.6M, 17.3k, 950
function abbreviate(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return addCommas(Math.round(num));
}

// convert moving time in seconds to total hours
function timeConverter(timeInSeconds: number, monthsActive?: number): ConvertedValue {
  const hours = timeInSeconds / 3600;

  return {
    label: 'Time on Bike',
    value: addCommas(Math.round(hours)),
    unit: 'h',
    subtitle: monthlyAverage(hours, 'h', monthsActive)
  };
}

// convert distance in meters to either miles/km based on user preference
function distanceConverter(distanceInMeters: number, metricPreference: string, monthsActive?: number): ConvertedValue {
  const imperial = metricPreference === 'feet';
  const distance = imperial ? distanceInMeters * 0.000621371 : distanceInMeters * 0.001;
  const unit = imperial ? 'mi' : 'km';

  return {
    label: 'Total Distance',
    value: abbreviate(distance),
    unit,
    subtitle: monthlyAverage(distance, unit, monthsActive)
  };
}

// convert elevation gain to feet/meters based on user preference
function elevationConverter(elevationInMeters: number, metricPreference: string, monthsActive?: number): ConvertedValue {
  const imperial = metricPreference === 'feet';
  const elevation = imperial ? elevationInMeters * 3.28084 : elevationInMeters;
  const unit = imperial ? 'ft' : 'm';

  return {
    label: 'Total Climbing',
    value: abbreviate(elevation),
    unit,
    subtitle: monthlyAverage(elevation, unit, monthsActive)
  };
}

// adds commas to numbers for readability
function addCommas(intNum: number): string {
  return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
}

export default StatsCard;