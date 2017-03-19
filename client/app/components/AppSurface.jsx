import React from 'react';
import BikeInfoSurface from './bikeinfo/BikeInfoSurface.jsx';
import LoginSurface from './login/LoginSurface.jsx';
import * as request from 'superagent';

class AppSurface extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ready: false };
        this.isAuthenticated = this.isAuthenticated.bind(this);
        this.isAuthenticated();
    }
    isAuthenticated() {
        request.get('/api/isAuthenticated')
            .then(() => {
                window.history.pushState('', '', '/');
                this.setState({ ready: true, isLoggedIn: true });
            })
            .catch((err) => {
                console.log('isAuthenticated', err);
                this.setState({ ready: true, isLoggedIn: false });
            });
    }
    render() {
        return this.state.ready && this.state.isLoggedIn ?
            (<BikeInfoSurface />) :
            (<LoginSurface isAuthenticated={this.isAuthenticated} />);

    }
}
export default AppSurface;