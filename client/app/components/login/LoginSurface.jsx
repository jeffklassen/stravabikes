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
            });
    }

    render() {
        return (<div>
            {this.state.authcode ? (<span>loading...</span>) :
                (<LoginLink />)}
        </div>);
    }
}
export default LoginSurface;