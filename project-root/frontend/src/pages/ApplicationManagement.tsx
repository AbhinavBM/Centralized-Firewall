import React, { useEffect } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useApplications } from '../hooks/useApplications';
import { Link } from 'react-router-dom';

const ApplicationManagement = () => {
    const { applications, fetchApplications } = useApplications();

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Application Management
            </Typography>
            <Button variant="contained" component={Link} to="/add-application" sx={{ marginBottom: 2 }}>
                Add Application
            </Button>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Version</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {applications.map((application) => (
                            <TableRow key={application.id}>
                                <TableCell>{application.id}</TableCell>
                                <TableCell>{application.name}</TableCell>
                                <TableCell>{application.version}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" sx={{ marginRight: 1 }}>Edit</Button>
                                    <Button variant="outlined" color="error">Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ApplicationManagement;
