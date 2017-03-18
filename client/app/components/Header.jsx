import React from 'react';

const Header = ({vendorName}) => {
  
    return (<div className="row">
        <div className="col-md-9">
        <h1 > My {vendorName} Bikes</h1></div>
        <div className="col-md-3"><img src = './Images/stravaPwrLogo.png' className = "pull-right"></img>
        </div></div>
    );
};
export default Header;