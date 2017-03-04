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
        request.get('/api/clientId')
            .then(clientIdResponse => {
                let clientId = clientIdResponse.body.clientId    ;
                this.setState({
                    url: `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=http://127.0.0.1:3000/client/&approval_prompt=auto`
                });
            });

    }
    render() {
        return (this.state.url ? (<a href={this.state.url}>
            <img src="/client/images/btn_strava_connectwith_orange@2x.png" />
        </a>) : <span>loading...</span>
        );
    }
}
export default LoginLink;