import React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, RouteComponentProps } from 'react-router-dom';
import Header from './components/Header';
import BikeInfoSurface from './components/bikeinfo/BikeInfoSurface';
import LoginSurface from './components/login/LoginSurface';

interface AppState {
  isLoggedIn: boolean;
}

interface RouteParams {
  chartType?: string;
  measure?: string;
}

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isLoggedIn: false
    };
  }

  render(): JSX.Element {
    return (
      <Router>
        <div className="container">
          <Header />
          <Switch>
            <Route
              exact
              path="/login"
              render={() => <LoginSurface />}
            />
            <Route
              path="/:chartType/:measure"
              render={({ match }: RouteComponentProps<RouteParams>) => (
                <BikeInfoSurface params={match.params} />
              )}
            />
            <Route
              path="/"
              exact
              render={() => <BikeInfoSurface />}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

const rootElement = document.getElementById('react-app');
if (rootElement) {
  ReactDOM.render(<App />, rootElement);
} else {
  console.error('Root element "react-app" not found');
}