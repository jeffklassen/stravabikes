import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import BikeInfoSurface from './components/bikeinfo/BikeInfoSurface.jsx';
import LoginSurface from './components/login/LoginSurface.jsx';
import * as request from 'superagent';

class AppSurface extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ready: false };
        this.isAuthenticated = this.isAuthenticated.bind(this);
        this.isAuthenticated();
    }
    isAuthenticated() {
        request.get('api/isAuthenticated')
            .then(() => {
                window.history.pushState('', '', '');
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




ReactDOM.render(
    <Router history={Router.hashHistory}>
        <div className="container">
            <Header />
            <Route exact={true} path="/" component={BikeInfoSurface} />
            <Route exact={true} path="/login" component={LoginSurface} />
        </div>
    </Router>,
    document.getElementById('react-app')
);
