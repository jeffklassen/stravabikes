import React from 'react';
import ReactDOM from 'react-dom';
import Header  from './Header.jsx';
import BikeInfoSurface  from './BikeInfoSurface.jsx';

const App = () => {
    return (
        <div className="container">
            <Header vendorName="Strava"/>
            <BikeInfoSurface />
        </div>
    );
};


ReactDOM.render(
    React.createElement(App),
    document.getElementById('react-app')
);
