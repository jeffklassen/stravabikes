import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Header from './components/Header.jsx';
import BikeInfoSurface from './components/bikeinfo/BikeInfoSurface.jsx';
import LoginSurface from './components/login/LoginSurface.jsx';
import * as request from 'superagent';
import authService from './services/authService.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false
        };
        this.checkAuth = this
            .checkAuth
            .bind(this);
        // this.checkAuth();
    }
    checkAuth() {
        authService
            .isAuthenticated()
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
                    <Switch>
                        <Route
                            exact={true}
                            path="/login"
                            render={() => (<LoginSurface checkAuth={this.checkAuth} />)} />
                        <Route 
                            path="/:chartType?/:measure?/"
                            render={({ match }) => (<BikeInfoSurface params={match.params} checkAuth={this.checkAuth} />)} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

ReactDOM.render(
    <App />, document.getElementById('react-app'));
