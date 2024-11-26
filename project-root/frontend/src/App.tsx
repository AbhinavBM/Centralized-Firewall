import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import UserManagement from './pages/UserManagement';
import EndpointManagement from './pages/EndpointManagement';
import ApplicationManagement from './pages/ApplicationManagement';
import { AuthProvider } from './context/AuthContext';
import { EndpointProvider } from './context/EndpointContext';
import { ApplicationProvider } from './context/ApplicationContext';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <EndpointProvider>
                <ApplicationProvider>
                    <Router>
                        <Switch>
                            <Route path="/" exact component={Dashboard} />
                            <Route path="/login" component={Login} />
                            <Route path="/users" component={UserManagement} />
                            <Route path="/endpoints" component={EndpointManagement} />
                            <Route path="/applications" component={ApplicationManagement} />
                        </Switch>
                    </Router>
                </ApplicationProvider>
            </EndpointProvider>
        </AuthProvider>
    );
};

export default App;
