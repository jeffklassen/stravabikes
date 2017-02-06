import React from 'react';
import ReactDOM from 'react-dom';

const HelloWorld = () => {
    return <span>HelloWorld</span>;
};

ReactDOM.render(
    React.createElement(HelloWorld),
    document.getElementById('react-app')
);
