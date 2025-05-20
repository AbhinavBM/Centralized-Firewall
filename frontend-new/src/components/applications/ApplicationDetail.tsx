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
  fetchApplicationById,
  deleteApplication,
} from '../../store/slices/applicationSlice';
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
      id={`application-tabpanel-${index}`}
      aria-labelledby={`application-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const ApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selectedApplication, loading, error } = useSelector(
    (state: RootState) => state.applications
  );

  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchApplicationById(id));
    }
  }, [dispatch, id]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditApplication = () => {
    navigate(`/applications/edit/${id}`);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (id) {
      dispatch(deleteApplication(id));
      setDeleteDialogOpen(false);
      navigate('/applications');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleRefresh = () => {
    if (id) {
      dispatch(fetchApplicationById(id));
    }
  };

  if (loading && !selectedApplication) {
    return <LoadingSpinner message="Loading application details..." />;
  }

  if (!selectedApplication && !loading) {
    return (
      <Box>
        <PageHeader
          title="Application Not Found"
          breadcrumbs={[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Applications', path: '/applications' },
            { label: 'Application Details' },
          ]}
        />
        <Card>
          <CardContent>
            <Typography>
              The application you are looking for does not exist or has been deleted.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/applications')}
              sx={{ mt: 2 }}
            >
              Back to Applications
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title={`Application: ${selectedApplication?.name}`}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Applications', path: '/applications' },
          { label: selectedApplication?.name || 'Application Details' },
        ]}
        action={{
          label: 'Edit Application',
          onClick: handleEditApplication,
          icon: <EditIcon />,
        }}
      />

      {error && <ErrorAlert message={error} onRetry={handleRefresh} />}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h6">Application Details</Typography>
              <StatusChip
                status={selectedApplication?.status || 'pending'}
                statusMap={{
                  allowed: { label: 'Allowed', color: 'success' },
                  blocked: { label: 'Blocked', color: 'error' },
                  pending: { label: 'Pending', color: 'warning' },
                  suspended: { label: 'Suspended', color: 'error' },
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
                <IconButton onClick={handleEditApplication} disabled={loading}>
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
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Typography variant="body1">{selectedApplication?.description}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Created At
              </Typography>
              <Typography variant="body1">
                {selectedApplication?.createdAt
                  ? new Date(selectedApplication.createdAt).toLocaleString()
                  : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Updated At
              </Typography>
              <Typography variant="body1">
                {selectedApplication?.updatedAt
                  ? new Date(selectedApplication.updatedAt).toLocaleString()
                  : 'N/A'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Allowed Domains
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {selectedApplication?.allowedDomains && selectedApplication.allowedDomains.length > 0 ? (
                  selectedApplication.allowedDomains.map((domain) => (
                    <Chip key={domain} label={domain} />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No domains specified
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Allowed IPs
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {selectedApplication?.allowedIps && selectedApplication.allowedIps.length > 0 ? (
                  selectedApplication.allowedIps.map((ip) => <Chip key={ip} label={ip} />)
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No IP addresses specified
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Allowed Protocols
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {selectedApplication?.allowedProtocols && selectedApplication.allowedProtocols.length > 0 ? (
                  selectedApplication.allowedProtocols.map((protocol) => (
                    <Chip key={protocol} label={protocol} />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No protocols specified
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="application tabs">
          <Tab label="Firewall Rules" id="application-tab-0" aria-controls="application-tabpanel-0" />
          <Tab label="Endpoints" id="application-tab-1" aria-controls="application-tabpanel-1" />
          <Tab label="Traffic Logs" id="application-tab-2" aria-controls="application-tabpanel-2" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="body1">
            Firewall rules for this application will be displayed here.
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="body1">
            Endpoints associated with this application will be displayed here.
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="body1">
            Traffic logs for this application will be displayed here.
          </Typography>
        </TabPanel>
      </Paper>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Application"
        message="Are you sure you want to delete this application? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmColor="error"
      />
    </Box>
  );
};

export default ApplicationDetail;
