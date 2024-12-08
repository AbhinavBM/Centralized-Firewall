// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './components/Dashboard';
import { Provider } from 'react-redux';
import { store } from './store';
import MappingPage from './pages/MappingPage';
import ApplicationsPage from './pages/ApplicationsPage';
import ApplicationFormPage from './components/ApplicationForm';
import ApplicationListPage from './components/ApplicationList';
import NavBar from './components/NavBar';
import LogPage from './pages/LogPage'; // Import LogPage

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <NavBar />
          <Routes>
            {/* Auth Routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Dashboard Route */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Application Routes */}
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/applications/create" element={<ApplicationFormPage />} />
            <Route path="/applications/:id" element={<ApplicationListPage />} />
            <Route path="/edit-application/:id" element={<ApplicationFormPage />} />
            
            {/* Mappings Route */}
            <Route path="/mappings" element={<MappingPage />} />
            
            {/* Log Page Route */}
            <Route path="/logs" element={<LogPage />} /> {/* New Log Page Route */}
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
};

export default App;
