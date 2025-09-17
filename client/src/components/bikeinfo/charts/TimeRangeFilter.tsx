import React, { CSSProperties } from 'react';
import { getThemeColors } from '../../../styles/solarized';

export interface TimeRange {
  label: string;
  value: 'all' | '7d' | '30d' | '90d' | '1y' | 'custom';
  days?: number;
}

interface TimeRangeFilterProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  darkMode?: boolean;
}

const timeRanges: TimeRange[] = [
  { label: 'All Time', value: 'all' },
  { label: 'Last 7 Days', value: '7d', days: 7 },
  { label: 'Last 30 Days', value: '30d', days: 30 },
  { label: 'Last 90 Days', value: '90d', days: 90 },
  { label: 'Last Year', value: '1y', days: 365 }
];

const TimeRangeFilter = ({ selectedRange, onRangeChange, darkMode = false }: TimeRangeFilterProps): React.ReactElement => {
  const colors = getThemeColors(darkMode);

  const containerStyle: CSSProperties = {
    backgroundColor: colors.cardBackground,
    border: `1px solid ${colors.border}`,
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: colors.shadow
  };

  const headerStyle: CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const buttonGroupStyle: CSSProperties = {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  };

  const getButtonStyle = (isSelected: boolean): CSSProperties => ({
    background: isSelected ? colors.accent : 'none',
    border: `1px solid ${isSelected ? colors.accent : colors.border}`,
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    color: isSelected ? colors.cardBackground : colors.textSecondary,
    transition: 'all 0.2s ease',
    fontWeight: isSelected ? '600' : '400'
  });

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <span>Time Range</span>
      </div>

      <div style={buttonGroupStyle}>
        {timeRanges.map((range) => {
          const isSelected = selectedRange.value === range.value;
          return (
            <button
              key={range.value}
              style={getButtonStyle(isSelected)}
              onClick={() => onRangeChange(range)}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = colors.surfaceBackground;
                  e.currentTarget.style.borderColor = colors.accent;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = colors.border;
                }
              }}
            >
              {range.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeRangeFilter;