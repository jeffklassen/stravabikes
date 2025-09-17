import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BikeInfoSurface from './components/bikeinfo/BikeInfoSurface';
import LoginSurface from './components/login/LoginSurface';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { getThemeColors } from './styles/solarized';

interface AppState {
  isLoggedIn: boolean;
}


class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isLoggedIn: false
    };
  }

  render(): React.ReactElement {
    return (
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    );
  }
}

const AppContent = (): React.ReactElement => {
  const { darkMode } = useTheme();
  const colors = getThemeColors(darkMode);

  React.useEffect(() => {
    document.body.style.backgroundColor = colors.background;
    document.body.style.margin = '0';
    document.body.style.transition = 'background-color 0.2s ease';
  }, [darkMode, colors.background]);

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
};

const rootElement = document.getElementById('react-app');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
} else {
  console.error('Root element "react-app" not found');
}