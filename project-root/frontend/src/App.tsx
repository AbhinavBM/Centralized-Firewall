import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import your AuthProvider
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './components/Dashboard';
import { Provider } from 'react-redux';
import { store } from './store';
import ApplicationsPage from './pages/ApplicationsPage';
import ApplicationFormPage from './components/ApplicationForm'; // New page for creating applications
import ApplicationListPage from './components/ApplicationList'; // New page for listing applications
import NavBar from './components/NavBar';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthProvider> {/* Now AuthProvider can accept children */}
        <Router>
        <NavBar />
          <Routes>
            {/* Auth Routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Dashboard Route */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Application Routes */}
            <Route path="/applications" element={<ApplicationsPage />} /> {/* List of Applications */}
            <Route path="/applications/create" element={<ApplicationFormPage />} /> {/* Create Application */}
            <Route path="/applications/:id" element={<ApplicationListPage />} /> {/* View Specific Application */}
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
};

export default App;
