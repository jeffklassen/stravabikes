import React, { CSSProperties } from 'react';
import { StravaBike } from '../../../../../types/strava';
import { getThemeColors } from '../../../styles/solarized';

interface BikeSelectorProps {
  bikes: StravaBike[];
  selectedBikes: string[];
  onSelectionChange: (selectedBikes: string[]) => void;
  darkMode?: boolean;
}

const BikeSelector = ({ bikes, selectedBikes, onSelectionChange, darkMode = false }: BikeSelectorProps): React.ReactElement => {
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

  const controlsStyle: CSSProperties = {
    display: 'flex',
    gap: '8px'
  };

  const buttonStyle: CSSProperties = {
    background: 'none',
    border: `1px solid ${colors.border}`,
    borderRadius: '6px',
    padding: '4px 8px',
    fontSize: '12px',
    cursor: 'pointer',
    color: colors.textSecondary,
    transition: 'all 0.2s ease'
  };

  const bikeListStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  const bikeItemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px',
    borderRadius: '8px',
    transition: 'background-color 0.2s ease',
    cursor: 'pointer'
  };

  const checkboxStyle: CSSProperties = {
    width: '16px',
    height: '16px',
    accentColor: colors.accent,
    cursor: 'pointer'
  };

  const bikeNameStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: '500',
    color: colors.textPrimary,
    flex: 1
  };

  const bikeStatsStyle: CSSProperties = {
    fontSize: '12px',
    color: colors.textMuted,
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  };

  const colorDotStyle = (bikeId: string): CSSProperties => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: getBikeColor(bikeId, bikes),
    marginRight: '4px'
  });

  const handleBikeToggle = (bikeId: string) => {
    const newSelection = selectedBikes.includes(bikeId)
      ? selectedBikes.filter(id => id !== bikeId)
      : [...selectedBikes, bikeId];
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    onSelectionChange(bikes.map(bike => bike.id));
  };

  const handleSelectNone = () => {
    onSelectionChange([]);
  };

  const activeBikes = bikes.filter(bike => bike.distance && bike.distance > 0);
  const selectedCount = selectedBikes.length;
  const totalCount = activeBikes.length;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <span>
          Bikes ({selectedCount}/{totalCount} selected)
        </span>
        <div style={controlsStyle}>
          <button
            style={buttonStyle}
            onClick={handleSelectAll}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.surfaceBackground;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            All
          </button>
          <button
            style={buttonStyle}
            onClick={handleSelectNone}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.surfaceBackground;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            None
          </button>
        </div>
      </div>

      <div style={bikeListStyle}>
        {activeBikes.map((bike) => {
          const isSelected = selectedBikes.includes(bike.id);
          return (
            <div
              key={bike.id}
              style={{
                ...bikeItemStyle,
                backgroundColor: isSelected ? colors.surfaceBackground : 'transparent'
              }}
              onClick={() => handleBikeToggle(bike.id)}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = colors.surfaceBackground;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleBikeToggle(bike.id)}
                style={checkboxStyle}
                onClick={(e) => e.stopPropagation()}
              />
              <div style={colorDotStyle(bike.id)} />
              <div style={bikeNameStyle}>{bike.name}</div>
              <div style={bikeStatsStyle}>
                🚴 {bike.distance ? formatDistance(bike.distance) : '0 mi'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Generate consistent colors for bikes based on their ID
function getBikeColor(bikeId: string, bikes: StravaBike[]): string {
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

// Format distance with appropriate units
function formatDistance(distanceInMeters: number): string {
  const miles = distanceInMeters * 0.000621371;
  if (miles >= 1000) {
    return `${(miles / 1000).toFixed(1)}k mi`;
  }
  return `${Math.round(miles)} mi`;
}

export default BikeSelector;