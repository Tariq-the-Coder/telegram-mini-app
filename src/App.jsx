import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { UserProvider } from './Context/UserContext';
import PremiumDashboard from './components/PremiumDashboard';
import SubscriptionPage from './pages/SubscriptionPage';
import RedirectIfPremium from './Context/RedirectIfPremium';
import PrivateRoute from './Context/PrivateRoute'; // Import PrivateRoute

const App = () => {
  return (
    <UserProvider>
      <Router>
        <main>
          <Routes>
            {/* Redirect if the user is premium */}
            <Route
              path="/"
              element={
                <RedirectIfPremium>
                  <SubscriptionPage />
                </RedirectIfPremium>
              }
            />

            {/* Protected Route for Premium Dashboard */}
            <Route
              path="/premium-dashboard"
              element={
                <PrivateRoute>
                  <PremiumDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </Router>
    </UserProvider>
  );
};

export default App;
