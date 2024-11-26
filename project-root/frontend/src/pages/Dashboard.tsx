import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEndpoints } from '../hooks/useEndpoints';
import { useApplications } from '../hooks/useApplications';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { endpoints, fetchEndpoints } = useEndpoints();
    const { applications, fetchApplications } = useApplications();

    useEffect(() => {
        fetchEndpoints();
        fetchApplications();
    }, [fetchEndpoints, fetchApplications]);

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Welcome, {user?.name}
            </Typography>
            <Typography variant="body1" paragraph>
                Here are your key metrics and links to manage endpoints, applications, and users.
            </Typography>

            <Button variant="contained" onClick={logout} sx={{ marginBottom: 2 }}>
                Logout
            </Button>

            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" component={Link} to="/endpoint-management">
                    Manage Endpoints
                </Button>
                <Button variant="contained" component={Link} to="/application-management">
                    Manage Applications
                </Button>
                <Button variant="contained" component={Link} to="/user-management">
                    Manage Users
                </Button>
            </Box>

            <Box sx={{ marginTop: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Endpoints:
                </Typography>
                <ul>
                    {endpoints.map((endpoint) => (
                        <li key={endpoint.id}>{endpoint.name}</li>
                    ))}
                </ul>

                <Typography variant="h5" gutterBottom>
                    Applications:
                </Typography>
                <ul>
                    {applications.map((app) => (
                        <li key={app.id}>{app.name}</li>
                    ))}
                </ul>
            </Box>
        </Box>
    );
};

export default Dashboard;
