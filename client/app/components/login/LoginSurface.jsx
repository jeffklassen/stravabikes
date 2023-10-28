import LoginLink from "./LoginLink.jsx";
import React from "react";
import activitiesService from "../../services/activitiesService";
import authService from "../../services/authService.js";
import queryString from "query-string";

class LoginSurface extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    if (this.isAuthenticated()) {
      this.props.isAuthenticated;
    }

    const queryParams = queryString.parse(location.search);
    if (queryParams.code) {
      this.state.authcode = queryParams.code;
      this.saveAuthCode(this.state.authcode);
    }
  }
  async isAuthenticated() {
    const isAuthenticated = await authService.isAuthenticated();
    return isAuthenticated.loggedIn || false;
  }
  async saveAuthCode(authCode) {
    const sessionId = await authService.completeLoginWithStrava(authCode);

    //console.log(response.body);
    this.setState({ msg: "updating your data" });
    let resp = await activitiesService.getActivities();

    this.setState({ msg: `loaded ${resp.body.length} activities` });
    this.props.history.replace({ pathname: "/" });
  }

  render() {
    return (
      <div>
        {this.state.authcode ? (
          <span>{this.state.msg || "completing login with strava"}</span>
        ) : (
          <LoginLink />
        )}
      </div>
    );
  }
}
export default LoginSurface;
