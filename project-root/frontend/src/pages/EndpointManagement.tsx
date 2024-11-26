import React, { useEffect } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useEndpoints } from '../hooks/useEndpoints';
import { Link } from 'react-router-dom';

const EndpointManagement = () => {
    const { endpoints, fetchEndpoints } = useEndpoints();

    useEffect(() => {
        fetchEndpoints();
    }, [fetchEndpoints]);

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Endpoint Management
            </Typography>
            <Button variant="contained" component={Link} to="/add-endpoint" sx={{ marginBottom: 2 }}>
                Add Endpoint
            </Button>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>IP</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {endpoints.map((endpoint) => (
                            <TableRow key={endpoint.id}>
                                <TableCell>{endpoint.id}</TableCell>
                                <TableCell>{endpoint.name}</TableCell>
                                <TableCell>{endpoint.ip}</TableCell>
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

export default EndpointManagement;
