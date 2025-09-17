// Solarized color palette
export const solarized = {
  // Base colors
  base03: '#002b36', // darkest
  base02: '#073642',
  base01: '#586e75',
  base00: '#657b83',
  base0: '#839496',
  base1: '#93a1a1',
  base2: '#eee8d5',
  base3: '#fdf6e3', // lightest

  // Accent colors
  yellow: '#b58900',
  orange: '#cb4b16',
  red: '#dc322f',
  magenta: '#d33682',
  violet: '#6c71c4',
  blue: '#268bd2',
  cyan: '#2aa198',
  green: '#859900',

  // Strava brand
  strava: '#fc4c02'
};

export const getThemeColors = (darkMode: boolean) => ({
  // Backgrounds
  background: darkMode ? solarized.base03 : solarized.base3,
  surfaceBackground: darkMode ? solarized.base02 : solarized.base2,
  cardBackground: darkMode ? solarized.base02 : '#ffffff',

  // Borders
  border: darkMode ? solarized.base01 : solarized.base1,
  borderHover: darkMode ? solarized.base0 : solarized.base00,

  // Text
  textPrimary: darkMode ? solarized.base1 : solarized.base01,
  textSecondary: darkMode ? solarized.base0 : solarized.base00,
  textMuted: darkMode ? solarized.base01 : solarized.base1,

  // Interactive elements
  accent: solarized.strava,
  accentHover: darkMode ? solarized.orange : solarized.red,

  // Status colors
  success: solarized.green,
  warning: solarized.yellow,
  error: solarized.red,
  info: solarized.blue,

  // Shadows
  shadow: darkMode
    ? '0 2px 8px rgba(0, 0, 0, 0.6)'
    : '0 2px 8px rgba(101, 123, 131, 0.15)',
  shadowHover: darkMode
    ? '0 4px 16px rgba(0, 0, 0, 0.8)'
    : '0 4px 16px rgba(101, 123, 131, 0.25)'
});