import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import BikeInfoSurface from "./components/bikeinfo/BikeInfoSurface.jsx";
import Header from "./components/Header.jsx";
import LoginSurface from "./components/login/LoginSurface.jsx";
import React from "react";
import ReactDOM from "react-dom/client";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
    };
  }
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<BikeInfoSurface />} />
            <Route path="login" element={<LoginSurface />} />
            <Route
              path=":chartType/:measure"
              element={({ match }) => <BikeInfoSurface params={match.params} />}
            />
            <Route path="/" exact element={() => <BikeInfoSurface />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }
}

function Layout() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("react-app")).render(<App />);
