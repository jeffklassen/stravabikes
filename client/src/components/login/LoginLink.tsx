import React, { Component } from 'react';
import authService from '../../services/authService';
import { StravaAuthProvider } from '../../../../types/strava';

interface LoginLinkState {
  url?: string;
}

class LoginLink extends Component<{}, LoginLinkState> {
  private _isMounted: boolean;

  constructor(props: {}) {
    super(props);
    this.state = {};
    this.getLoginUrl = this.getLoginUrl.bind(this);
    this._isMounted = false;
  }

  componentDidMount(): void {
    this._isMounted = true;
    this.getLoginUrl();
  }

  componentWillUnmount(): void {
    this._isMounted = false;
  }

  async getLoginUrl(): Promise<void> {
    try {
      const authDetailsResponse = await authService.getStravaAuthDetails();
      const { authUrl, clientId, redirectUri, scope }: StravaAuthProvider = authDetailsResponse.body;

      if (this._isMounted) {
        this.setState({
          url: `${authUrl}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=auto&scope=${scope}`
        });
      }
    } catch (error) {
      console.error('Failed to get login URL:', error);
    }
  }

  render(): React.ReactElement {
    return this.state.url ? (
      <a href={this.state.url}>
        <img src="./Images/btn_strava_connectwith_orange@2x.png" alt="Connect with Strava" />
      </a>
    ) : (
      <span>loading...</span>
    );
  }
}

export default LoginLink;