import React from 'react';
import queryString from 'query-string';
import LoginLink from './LoginLink.jsx';
import authService from '../../services/authService.js';
import activitiesService from '../../services/activitiesService';
import { withRouter } from 'react-router-dom';

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
    async saveAuthCode(authCode) {
        await authService.completeLoginWithStrava(authCode);

        //console.log(response.body);
        this.setState({ msg: 'updating your data' });
        let resp = await activitiesService.loadActivities();


        this.setState({ msg: `loaded ${resp.body.activityCount} activities` });
        this.props.history.replace({ pathname: '/' });

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
export default withRouter(LoginSurface);