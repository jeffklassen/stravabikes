import React, { CSSProperties } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getThemeColors } from '../styles/solarized';

const ThemeToggle = (): React.ReactElement => {
  const { darkMode, toggleDarkMode } = useTheme();
  const colors = getThemeColors(darkMode);

  const toggleStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '8px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    fontSize: '14px',
    fontWeight: '500',
    color: colors.textPrimary,
    gap: '8px'
  };

  const iconStyle: CSSProperties = {
    fontSize: '16px',
    transition: 'transform 0.2s ease'
  };

  return (
    <button
      style={toggleStyle}
      onClick={toggleDarkMode}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.surfaceBackground;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
      title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
    >
      <span style={iconStyle}>
        {darkMode ? '☀️' : '🌙'}
      </span>
      {darkMode ? 'Light' : 'Dark'}
    </button>
  );
};

export default ThemeToggle;