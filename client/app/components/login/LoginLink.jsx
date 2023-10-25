import React from "react";
import authService from "../../services/authService.js";
class LoginLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getLoginUrl = this.getLoginUrl.bind(this);
    this._isMounted = false;
  }
  componentDidMount() {
    this._isMounted = true;
    this.getLoginUrl();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  async getLoginUrl() {
    let authDetailsResponse = await authService.getStravaAuthDetails();

    let { authUrl, clientId, redirectUri, scope } = authDetailsResponse.body;
    if (this._isMounted) {
      this.setState({
        url: `${authUrl}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=auto&scope=${scope}`,
      });
    }
  }
  render() {
    return this.state.url ? (
      <a href={this.state.url}>
        <img src="./Images/btn_strava_connectwith_orange@2x.png" />
      </a>
    ) : (
      <span>loading...</span>
    );
  }
}
export default LoginLink;
