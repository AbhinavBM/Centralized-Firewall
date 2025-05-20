import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '../../store/store';
import {
  fetchEndpointById,
  deleteEndpoint,
  updateEndpointStatus,
} from '../../store/slices/endpointSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import ConfirmDialog from '../common/ConfirmDialog';
import PageHeader from '../common/PageHeader';
import StatusChip from '../common/StatusChip';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`endpoint-tabpanel-${index}`}
      aria-labelledby={`endpoint-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const EndpointDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selectedEndpoint, loading, error } = useSelector((state: RootState) => state.endpoints);

  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchEndpointById(id));
    }
  }, [dispatch, id]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditEndpoint = () => {
    navigate(`/endpoints/edit/${id}`);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (id) {
      dispatch(deleteEndpoint(id));
      setDeleteDialogOpen(false);
      navigate('/endpoints');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleRefresh = () => {
    if (id) {
      dispatch(fetchEndpointById(id));
    }
  };

  const handleStatusChange = (status: 'online' | 'offline' | 'pending' | 'error') => {
    if (id) {
      dispatch(updateEndpointStatus({ id, status }));
    }
  };

  if (loading && !selectedEndpoint) {
    return <LoadingSpinner message="Loading endpoint details..." />;
  }

  if (!selectedEndpoint && !loading) {
    return (
      <Box>
        <PageHeader
          title="Endpoint Not Found"
          breadcrumbs={[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Endpoints', path: '/endpoints' },
            { label: 'Endpoint Details' },
          ]}
        />
        <Card>
          <CardContent>
            <Typography>The endpoint you are looking for does not exist or has been deleted.</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/endpoints')}
              sx={{ mt: 2 }}
            >
              Back to Endpoints
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title={`Endpoint: ${selectedEndpoint?.hostname}`}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Endpoints', path: '/endpoints' },
          { label: selectedEndpoint?.hostname || 'Endpoint Details' },
        ]}
        action={{
          label: 'Edit Endpoint',
          onClick: handleEditEndpoint,
          icon: <EditIcon />,
        }}
      />

      {error && <ErrorAlert message={error} onRetry={handleRefresh} />}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h6">Endpoint Details</Typography>
              <StatusChip
                status={selectedEndpoint?.status || 'pending'}
                statusMap={{
                  online: { label: 'Online', color: 'success' },
                  offline: { label: 'Offline', color: 'error' },
                  pending: { label: 'Pending', color: 'warning' },
                  error: { label: 'Error', color: 'error' },
                }}
              />
            </Box>
            <Box>
              <Tooltip title="Refresh">
                <IconButton onClick={handleRefresh} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton onClick={handleEditEndpoint} disabled={loading}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={handleDeleteClick} disabled={loading} color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Hostname
              </Typography>
              <Typography variant="body1">{selectedEndpoint?.hostname}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                IP Address
              </Typography>
              <Typography variant="body1">{selectedEndpoint?.ipAddress}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Operating System
              </Typography>
              <Typography variant="body1">{selectedEndpoint?.os || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Last Heartbeat
              </Typography>
              <Typography variant="body1">
                {selectedEndpoint?.lastHeartbeat
                  ? new Date(selectedEndpoint.lastHeartbeat).toLocaleString()
                  : 'Never'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Created At
              </Typography>
              <Typography variant="body1">
                {selectedEndpoint?.createdAt
                  ? new Date(selectedEndpoint.createdAt).toLocaleString()
                  : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Updated At
              </Typography>
              <Typography variant="body1">
                {selectedEndpoint?.updatedAt
                  ? new Date(selectedEndpoint.updatedAt).toLocaleString()
                  : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Status
              </Typography>
              <Box display="flex" gap={1}>
                <Chip
                  label="Online"
                  color={selectedEndpoint?.status === 'online' ? 'success' : 'default'}
                  onClick={() => handleStatusChange('online')}
                  clickable
                />
                <Chip
                  label="Offline"
                  color={selectedEndpoint?.status === 'offline' ? 'error' : 'default'}
                  onClick={() => handleStatusChange('offline')}
                  clickable
                />
                <Chip
                  label="Pending"
                  color={selectedEndpoint?.status === 'pending' ? 'warning' : 'default'}
                  onClick={() => handleStatusChange('pending')}
                  clickable
                />
                <Chip
                  label="Error"
                  color={selectedEndpoint?.status === 'error' ? 'error' : 'default'}
                  onClick={() => handleStatusChange('error')}
                  clickable
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="endpoint tabs">
          <Tab label="Applications" id="endpoint-tab-0" aria-controls="endpoint-tabpanel-0" />
          <Tab label="Traffic Logs" id="endpoint-tab-1" aria-controls="endpoint-tabpanel-1" />
          <Tab label="Anomalies" id="endpoint-tab-2" aria-controls="endpoint-tabpanel-2" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="body1">
            Applications associated with this endpoint will be displayed here.
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="body1">
            Traffic logs for this endpoint will be displayed here.
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="body1">
            Anomalies detected for this endpoint will be displayed here.
          </Typography>
        </TabPanel>
      </Paper>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Endpoint"
        message="Are you sure you want to delete this endpoint? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmColor="error"
      />
    </Box>
  );
};

export default EndpointDetail;
