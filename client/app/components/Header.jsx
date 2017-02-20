import React from 'react';

const Header = ({vendorName}) => {
  
    return (<div className="row">
        <h1 > My {vendorName} Bikes</h1>
        </div>
    );
};
export default Header;