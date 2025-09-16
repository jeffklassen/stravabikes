import React from 'react';

const Header = (): React.ReactElement => {
  return (
    <div className="row">
      <div className="col-md-9">
        <h1>Track My Bike</h1>
      </div>
      <div className="col-md-3">
        <img src="/Images/stravaPwrLogo.png" className="pull-right" alt="Strava Logo" />
      </div>
    </div>
  );
};

export default Header;