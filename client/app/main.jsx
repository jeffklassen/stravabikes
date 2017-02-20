import React from 'react';
import ReactDOM from 'react-dom';
import Header  from './components/Header.jsx';
import BikeInfoSurface  from './components/BikeInfoSurface.jsx';

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
