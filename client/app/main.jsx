import React from 'react';
import ReactDOM from 'react-dom';
import Header  from './components/Header.jsx';
import AppSurface  from './components/AppSurface.jsx';

const App = () => {
    return (
        <div className="container">
            <Header/>
            <AppSurface />
        </div>
    );
};


ReactDOM.render(
    React.createElement(App),
    document.getElementById('react-app')
);
