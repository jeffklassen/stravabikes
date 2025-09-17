// adapted from here: http://redux.js.org/docs/basics/ExampleTodoList.html

import React, { ReactNode, CSSProperties } from 'react';
import { useTheme } from '../context/ThemeContext';

interface LinkProps {
  children: ReactNode;
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  style?: CSSProperties;
}

const Link = ({ children, onClick, style }: LinkProps): React.ReactElement => {
  const { darkMode } = useTheme();

  const defaultStyle: CSSProperties = {
    cursor: 'pointer',
    textDecoration: 'none',
    color: style?.color || '#fc4c02',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    border: darkMode ? '1px solid #404040' : '1px solid #e1e5e9',
    backgroundColor: darkMode ? '#333333' : '#ffffff',
    transition: 'all 0.2s ease',
    display: 'inline-block'
  };

  const combinedStyle = { ...defaultStyle, ...style };

  return (
    <a
      style={combinedStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = darkMode ? '#404040' : '#f5f5f5';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = darkMode ? '#333333' : '#ffffff';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {children}
    </a>
  );
};

export default Link;