import React from 'react';
import * as request from 'superagent';
import queryString from 'query-string';
import LoginLink from './LoginLink.jsx';

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
        request
            .post('/api/connectToStrava')
            .send({ authCode })
            .then(response => {
                console.log(response.body);
                this.setState({ msg: 'updating your data' });
                return request.get('/api/loadActivities');
            })
            .then(resp => {
                this.setState({ msg: `loaded ${resp.body.activityCount} activities` });
            })
            ;
    }

    render() {
        return (<div>
            {this.state.authcode ? (<span>{this.state.msg|| 'completing login with strava'}</span>) :
                (<LoginLink />)}
        </div>);
    }
}
export default LoginSurface;