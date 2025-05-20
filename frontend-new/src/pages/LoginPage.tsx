import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import LoginForm from '../components/auth/LoginForm';
import { RootState } from '../store/store';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: 'transparent',
              }}
            >
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 'bold', color: 'primary.main' }}
              >
                Centralized Firewall
              </Typography>
              <Typography variant="h6" color="text.secondary" align="center" paragraph>
                Secure your network with our advanced firewall management system
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} display="flex" justifyContent="center">
            <LoginForm />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage;
