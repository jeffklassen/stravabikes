import React, { CSSProperties } from 'react';
import { formatDuration, intervalToDuration } from 'date-fns';

interface Summary {
  field: string;
  total: number;
}

interface ConvertedValue {
  label: string;
  value: string;
}

interface MetricProps {
  summary: Summary;
  metricPreference: string;
}

const Metric = ({ summary, metricPreference }: MetricProps): React.ReactElement => {
  const metricStyle: CSSProperties = { display: 'block', color: '#fc4c02' };
  const fieldStyle: CSSProperties = { display: 'block' };
  const summaryStyle: CSSProperties = {
    fontSize: 16,
    fontWeight: 700,
    marginLeft: '12px',
    display: 'inline-block',
    padding: '14px'
  };

  const convertedValue = conversionPasser(summary, metricPreference);

  return (
    <div className="summary" style={summaryStyle}>
      <div style={metricStyle}>{convertedValue.value}</div>
      <div style={fieldStyle}>{convertedValue.label}</div>
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

  // Default fallback
  return { label: 'unknown', value: '0' };
}

// convert time in seconds to human readable time
function timeConverter(timeInSeconds: number): ConvertedValue {
  const duration = intervalToDuration({ start: 0, end: timeInSeconds * 1000 });
  const formatted = formatDuration(duration, {
    format: ['years', 'months', 'days', 'hours', 'minutes'],
    delimiter: ' '
  });
  return { label: 'time adventuring', value: formatted || '0 minutes' };
}

// convert distance in meters to either miles/km based on user preference. then adds commas
function distanceConverter(distanceInMeters: number, metricPreference: string): ConvertedValue {
  if (metricPreference === 'feet') {
    const distanceTotal = addCommas(Math.round(distanceInMeters * 0.000621371));
    return { label: 'miles pedaled', value: distanceTotal };
  } else {
    const distanceTotal = addCommas(Math.round(distanceInMeters * 0.001));
    return { label: 'kilometers pedaled', value: distanceTotal };
  }
}

// convert elevation gain to feet/meters based on user preference. then adds commas
function elevationConverter(elevationinMeters: number, metricPreference: string): ConvertedValue {
  if (metricPreference === 'feet') {
    const totalClimbed = addCommas(Math.round(elevationinMeters * 3.28084));
    return { label: 'feet climbed', value: totalClimbed };
  } else {
    const totalClimbed = addCommas(Math.round(elevationinMeters));
    return { label: 'meters climbed', value: totalClimbed };
  }
}

// adds commas to numbers for readability
function addCommas(intNum: number): string {
  return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
}

export default Metric;