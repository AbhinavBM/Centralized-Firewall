import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store/store';
import { getProfile } from './store/slices/authSlice';
import { WebSocketProvider } from './context/WebSocketContext';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Endpoint Pages
import EndpointsPage from './pages/EndpointsPage';
import EndpointCreatePage from './pages/EndpointCreatePage';
import EndpointEditPage from './pages/EndpointEditPage';
import EndpointDetailPage from './pages/EndpointDetailPage';
import EndpointApplicationMappingPage from './pages/EndpointApplicationMappingPage';

// Application Pages
import ApplicationsPage from './pages/ApplicationsPage';
import ApplicationCreatePage from './pages/ApplicationCreatePage';
import ApplicationEditPage from './pages/ApplicationEditPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import ApplicationFirewallRulesPage from './pages/ApplicationFirewallRulesPage';

// Firewall Pages
import FirewallRulesPage from './pages/FirewallRulesPage';
import FirewallRuleCreatePage from './pages/FirewallRuleCreatePage';
import FirewallRuleEditPage from './pages/FirewallRuleEditPage';
import FirewallRuleDetailPage from './pages/FirewallRuleDetailPage';

// Anomaly Pages
import AnomaliesPage from './pages/AnomaliesPage';
import AnomalyDetailPage from './pages/AnomalyDetailPage';

// Log Pages
import LogsPage from './pages/LogsPage';


// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

const App: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated, loading, user } = useSelector((state: RootState) => state.auth);

    // Use a ref to track if we've already fetched the profile
    const profileFetchedRef = React.useRef(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        // Only fetch profile once per session if authenticated
        if (token && isAuthenticated && !user && !profileFetchedRef.current) {
            profileFetchedRef.current = true;
            dispatch(getProfile());
        }
    }, [dispatch, isAuthenticated, user]);

    if (loading && localStorage.getItem('authToken')) {
        return <LoadingSpinner fullHeight message="Loading application..." />;
    }

    return (
        <WebSocketProvider>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* Dashboard */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />

                {/* Endpoint Routes */}
                <Route
                    path="/endpoints"
                    element={
                        <ProtectedRoute>
                            <EndpointsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/endpoints/create"
                    element={
                        <ProtectedRoute>
                            <EndpointCreatePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/endpoints/edit/:id"
                    element={
                        <ProtectedRoute>
                            <EndpointEditPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/endpoints/:id"
                    element={
                        <ProtectedRoute>
                            <EndpointDetailPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/endpoints/:id/applications"
                    element={
                        <ProtectedRoute>
                            <EndpointApplicationMappingPage />
                        </ProtectedRoute>
                    }
                />

                {/* Application Routes */}
                <Route
                    path="/applications"
                    element={
                        <ProtectedRoute>
                            <ApplicationsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/applications/create"
                    element={
                        <ProtectedRoute>
                            <ApplicationCreatePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/applications/edit/:id"
                    element={
                        <ProtectedRoute>
                            <ApplicationEditPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/applications/:id"
                    element={
                        <ProtectedRoute>
                            <ApplicationDetailPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/applications/:id/firewall-rules"
                    element={
                        <ProtectedRoute>
                            <ApplicationFirewallRulesPage />
                        </ProtectedRoute>
                    }
                />

                {/* Firewall Rules */}
                <Route
                    path="/firewall"
                    element={
                        <ProtectedRoute>
                            <FirewallRulesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/firewall/create"
                    element={
                        <ProtectedRoute>
                            <FirewallRuleCreatePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/firewall/edit/:id"
                    element={
                        <ProtectedRoute>
                            <FirewallRuleEditPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/firewall/:id"
                    element={
                        <ProtectedRoute>
                            <FirewallRuleDetailPage />
                        </ProtectedRoute>
                    }
                />

                {/* Anomalies */}
                <Route
                    path="/anomalies"
                    element={
                        <ProtectedRoute>
                            <AnomaliesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/anomalies/:id"
                    element={
                        <ProtectedRoute>
                            <AnomalyDetailPage />
                        </ProtectedRoute>
                    }
                />

                {/* Logs */}
                <Route
                    path="/logs"
                    element={
                        <ProtectedRoute>
                            <LogsPage />
                        </ProtectedRoute>
                    }
                />


                {/* Redirects and 404 */}
                <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </WebSocketProvider>
    );
};

export default App;
