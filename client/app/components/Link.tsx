// adapted from here: http://redux.js.org/docs/basics/ExampleTodoList.html

import React, { ReactNode, CSSProperties } from 'react';

interface LinkProps {
  children: ReactNode;
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  style?: CSSProperties;
}

const Link = ({ children, onClick, style }: LinkProps): JSX.Element => {
  const defaultStyle: CSSProperties = { cursor: 'pointer' };
  const combinedStyle = { ...defaultStyle, ...style };

  return (
    <a style={combinedStyle} onClick={onClick}>
      {children}
    </a>
  );
};

export default Link;