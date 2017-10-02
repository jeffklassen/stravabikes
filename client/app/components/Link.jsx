// adapted from here: http://redux.js.org/docs/basics/ExampleTodoList.html

import React from 'react';
import PropTypes from 'prop-types';

const Link = ({ children, onClick, style }) => {
    let defaultStyle = { cursor: 'pointer' };

    style = Object.assign({}, defaultStyle, style);

    return (
        <a style={style} onClick={onClick}>
            {children}
        </a>
    );
};

Link.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired
};

export default Link;