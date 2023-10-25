import * as request from "superagent";

import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";

import BikeInfoSurface from "./components/bikeinfo/BikeInfoSurface.jsx";
import Header from "./components/Header.jsx";
import LoginSurface from "./components/login/LoginSurface.jsx";
import React from "react";
import ReactDOM from "react-dom";
import authService from "./services/authService.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
    };
  }

  render() {
    return (
      <Router history={Router.hashHistory}>
        <div className="container">
          <Header />
          <Switch>
            <Route exact path="/login" render={() => <LoginSurface />} />
            <Route
              path="/:chartType/:measure"
              render={({ match }) => <BikeInfoSurface params={match.params} />}
            />
            <Route path="/" exact render={() => <BikeInfoSurface />}></Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("react-app"));
