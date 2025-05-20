import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Typography, Box } from '@mui/material';
import {
  Computer as ComputerIcon,
  Apps as AppsIcon,
  Security as SecurityIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import SystemOverviewCard from '../components/dashboard/SystemOverviewCard';
import TrafficChart from '../components/dashboard/TrafficChart';
import EndpointStatusChart from '../components/dashboard/EndpointStatusChart';
import RecentAnomalies from '../components/dashboard/RecentAnomalies';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import { fetchSystemOverview } from '../store/slices/dashboardSlice';
import { AppDispatch, RootState } from '../store/store';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { overview, loading, error } = useSelector((state: RootState) => state.dashboard);
  const { user } = useSelector((state: RootState) => state.auth);

  // Add a ref to track if we've already loaded the data
  const dataLoadedRef = React.useRef(false);
  // Add a ref to store the refresh interval
  const refreshIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Function to fetch data
    const fetchData = () => {
      // Only fetch if we're not already loading
      if (!loading) {
        dispatch(fetchSystemOverview());
      }
    };

    // Only fetch data if we don't have it yet or if the ref is false
    if (!overview && !dataLoadedRef.current) {
      dataLoadedRef.current = true;
      fetchData();
    }

    // Set up a refresh interval (every 60 seconds) if not already set
    if (!refreshIntervalRef.current) {
      refreshIntervalRef.current = setInterval(fetchData, 60000); // 60 seconds
    }

    // Clean up the interval on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [dispatch, overview, loading]);

  // Add a cleanup effect when component unmounts
  useEffect(() => {
    return () => {
      dataLoadedRef.current = false;
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner message="Loading dashboard data..." />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <ErrorAlert
          message={`Error loading dashboard data: ${error}`}
          onRetry={() => dispatch(fetchSystemOverview())}
        />
      </MainLayout>
    );
  }

  if (!overview) {
    return (
      <MainLayout>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No dashboard data available
          </Typography>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.username || 'User'}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Here's an overview of your network security
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Overview Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <SystemOverviewCard
            title="Endpoints"
            value={overview.endpointCount}
            icon={<ComputerIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SystemOverviewCard
            title="Applications"
            value={overview.applicationCount}
            icon={<AppsIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SystemOverviewCard
            title="Firewall Rules"
            value={overview.firewallRuleCount}
            icon={<SecurityIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SystemOverviewCard
            title="Active Anomalies"
            value={overview.activeAnomalyCount}
            icon={<WarningIcon />}
            color="#d32f2f"
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <TrafficChart data={overview.trafficData} />
        </Grid>
        <Grid item xs={12} md={4}>
          <EndpointStatusChart data={overview.endpointStatusData} />
        </Grid>

        {/* Recent Anomalies */}
        <Grid item xs={12}>
          <RecentAnomalies anomalies={overview.recentAnomalies} />
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default DashboardPage;
