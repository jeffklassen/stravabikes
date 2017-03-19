import React from 'react';
import * as request from 'superagent';

class LoginLink extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getLoginUrl = this.getLoginUrl.bind(this);
        this.getLoginUrl();
    }
    getLoginUrl() {
        request.get('api/authDetails')
            .then(authDetailsResponse => {
                let { authUrl, clientId, redirectUri } = authDetailsResponse.body;
                //http://127.0.0.1:3000/client/
                //https://www.strava.com/oauth/authorize
                this.setState({
                    url: `${authUrl}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=auto`
                });
            });

    }
    render() {
        return (this.state.url ? (<a href={this.state.url}>
            <img src="./Images/btn_strava_connectwith_orange@2x.png" />
        </a>) : <span>loading...</span>
        );
    }
}
export default LoginLink;