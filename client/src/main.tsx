import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BikeInfoSurface from './components/bikeinfo/BikeInfoSurface';
import LoginSurface from './components/login/LoginSurface';

interface AppState {
  isLoggedIn: boolean;
}

interface RouteParams {
  chartType: string;
  measure: string;
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
          <Routes>
            <Route path="/login" element={<LoginSurface isAuthenticated={async () => {}} />} />
            <Route
              path="/:chartType/:measure"
              element={<BikeInfoSurface />}
            />
            <Route path="/" element={<BikeInfoSurface />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

const rootElement = document.getElementById('react-app');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
} else {
  console.error('Root element "react-app" not found');
}