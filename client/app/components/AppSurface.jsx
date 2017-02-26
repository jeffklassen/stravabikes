import React from 'react';
import BikeInfoSurface from './BikeInfoSurface.jsx';
import LoginSurface from './login/LoginSurface.jsx';

class AppSurface extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loggedIn: false };
    }
    render() {
        return this.state.loggedIn ?
            (<BikeInfoSurface athleteid="" />) :
            (<LoginSurface onLogin="" />);

    }
}
export default AppSurface;