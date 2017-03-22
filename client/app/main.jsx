import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Header from './components/Header.jsx';
import BikeInfoSurface from './components/bikeinfo/BikeInfoSurface.jsx';
import LoginSurface from './components/login/LoginSurface.jsx';
import * as request from 'superagent';
import authService from './services/authService.js';

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


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoggedIn: false };
        this.checkAuth = this.checkAuth.bind(this);
    }
    checkAuth() {
        authService.isAuthenticated()
            .then(() => {
                this.setState({ isLoggedIn: true });
            })
            .catch(() => {
                this.setState({ isLoggedIn: false });
            });
    }
    render() {
        return (
            <Router history={Router.hashHistory}>
                <div className="container">
                    <Header />
                    <Route exact={true} path="/" render={() => (
                        this.state.isLoggedIn ? (
                            <BikeInfoSurface />

                        ) : (<Redirect to="/login" />)
                    )} />
                    <Route exact={true} path="/login" render={() => (
                        this.state.isLoggedIn ? (
                            <Redirect to="/" />
                        ) : (<LoginSurface checkAuth={this.checkAuth}/>)
                    )} />
                </div>
            </Router>
        );
    }
}


ReactDOM.render(
    <App/>,
    document.getElementById('react-app')
);
