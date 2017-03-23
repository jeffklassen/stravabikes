import React from 'react';
import queryString from 'query-string';
import LoginLink from './LoginLink.jsx';
import authService from '../../services/authService.js';
import activitiesService from '../../services/activitiesService';

class LoginSurface extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
        const queryParams = queryString.parse(location.search);
        if (queryParams.code) {
            this.state.authcode = queryParams.code;
            this.saveAuthCode(this.state.authcode);
        }

    }
    saveAuthCode(authCode) {
        authService.completeLoginWithStrava(authCode)
            .then(response => {
                //console.log(response.body);
                this.setState({ msg: 'updating your data' });
                return activitiesService.loadActivities();
            })
            .then(resp => {
                this.setState({ msg: `loaded ${resp.body.activityCount} activities` });
                return this.props.checkAuth();

            });
    }

    render() {
        return (<div>
            {this.state.authcode ? (
                <span>{this.state.msg || 'completing login with strava'}</span>
            ) : (
                    <LoginLink />
                )}
        </div>);
    }
}
export default LoginSurface;