import React, { CSSProperties } from 'react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { getThemeColors } from '../styles/solarized';

const Header = (): React.ReactElement => {
  const { darkMode } = useTheme();
  const colors = getThemeColors(darkMode);

  const headerStyle: CSSProperties = {
    backgroundColor: colors.cardBackground,
    color: colors.textPrimary,
    padding: '20px 0',
    marginBottom: '20px',
    borderBottom: `1px solid ${colors.border}`,
    transition: 'all 0.2s ease'
  };

  const titleStyle: CSSProperties = {
    margin: 0,
    fontSize: '28px',
    fontWeight: '600',
    color: colors.textPrimary
  };

  const subtitleStyle: CSSProperties = {
    margin: 0,
    fontSize: '14px',
    color: colors.accent,
    fontWeight: '400'
  };

  const rightSectionStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    justifyContent: 'flex-end'
  };

  return (
    <div style={headerStyle}>
      <div className="row" style={{ alignItems: 'center', margin: 0 }}>
        <div className="col-md-9">
          <h1 style={titleStyle}>Track My Bike</h1>
          <p style={subtitleStyle}>Powered by Strava</p>
        </div>
        <div className="col-md-3" style={rightSectionStyle}>
          <ThemeToggle />
          <img
            src="/Images/stravaPwrLogo.png"
            alt="Strava Logo"
            style={{
              height: '40px',
              opacity: darkMode ? 0.9 : 1,
              transition: 'opacity 0.2s ease'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;