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
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '../../store/store';
import {
  fetchAnomalyById,
  resolveAnomaly,
  deleteAnomaly,
  clearSelectedAnomaly,
} from '../../store/slices/anomalySlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import ConfirmDialog from '../common/ConfirmDialog';
import PageHeader from '../common/PageHeader';

const AnomalyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selectedAnomaly, loading, error } = useSelector((state: RootState) => state.anomalies);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchAnomalyById(id));
    }

    return () => {
      dispatch(clearSelectedAnomaly());
    };
  }, [dispatch, id]);

  const handleResolveClick = () => {
    setResolveDialogOpen(true);
  };

  const handleResolveConfirm = () => {
    if (id) {
      dispatch(resolveAnomaly(id));
      setResolveDialogOpen(false);
    }
  };

  const handleResolveCancel = () => {
    setResolveDialogOpen(false);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (id) {
      dispatch(deleteAnomaly(id));
      setDeleteDialogOpen(false);
      navigate('/anomalies');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleRefresh = () => {
    if (id) {
      dispatch(fetchAnomalyById(id));
    }
  };

  const handleBack = () => {
    navigate('/anomalies');
  };

  const getSeverityColor = (severity: string): 'error' | 'warning' | 'info' => {
    switch (severity) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'info';
    }
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading && !selectedAnomaly) {
    return <LoadingSpinner message="Loading anomaly details..." />;
  }

  if (!selectedAnomaly && !loading) {
    return (
      <Box>
        <PageHeader
          title="Anomaly Not Found"
          breadcrumbs={[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Anomalies', path: '/anomalies' },
            { label: 'Anomaly Details' },
          ]}
        />
        <Card>
          <CardContent>
            <Typography>
              The anomaly you are looking for does not exist or has been deleted.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
              sx={{ mt: 2 }}
            >
              Back to Anomalies
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title={`Anomaly: ${selectedAnomaly?.anomalyType}`}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Anomalies', path: '/anomalies' },
          { label: selectedAnomaly?.anomalyType || 'Anomaly Details' },
        ]}
        action={{
          label: 'Back to Anomalies',
          onClick: handleBack,
          icon: <ArrowBackIcon />,
        }}
      />

      {error && <ErrorAlert message={error} onRetry={handleRefresh} />}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h6">Anomaly Details</Typography>
              <Chip
                label={selectedAnomaly?.severity.toUpperCase()}
                color={getSeverityColor(selectedAnomaly?.severity || 'low')}
              />
              <Chip
                label={selectedAnomaly?.resolved ? 'Resolved' : 'Active'}
                color={selectedAnomaly?.resolved ? 'success' : 'error'}
              />
            </Box>
            <Box>
              <Tooltip title="Refresh">
                <IconButton onClick={handleRefresh} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              {selectedAnomaly && !selectedAnomaly.resolved && (
                <Tooltip title="Resolve">
                  <IconButton onClick={handleResolveClick} disabled={loading} color="success">
                    <CheckCircleIcon />
                  </IconButton>
                </Tooltip>
              )}
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
                Anomaly Type
              </Typography>
              <Typography variant="body1">{selectedAnomaly?.anomalyType}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Severity
              </Typography>
              <Typography variant="body1">{selectedAnomaly?.severity.toUpperCase()}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Endpoint
              </Typography>
              <Typography variant="body1">
                {typeof selectedAnomaly?.endpointId === 'object'
                  ? selectedAnomaly.endpointId.hostname
                  : 'Unknown'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Application
              </Typography>
              <Typography variant="body1">
                {selectedAnomaly?.applicationId
                  ? typeof selectedAnomaly.applicationId === 'object'
                    ? selectedAnomaly.applicationId.name
                    : 'Unknown'
                  : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Typography variant="body1">
                {selectedAnomaly?.description || 'No description provided'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Timestamp
              </Typography>
              <Typography variant="body1">{formatDate(selectedAnomaly?.timestamp)}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Typography variant="body1">
                {selectedAnomaly?.resolved ? 'Resolved' : 'Active'}
              </Typography>
            </Grid>
            {selectedAnomaly?.resolved && (
              <>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Resolved By
                  </Typography>
                  <Typography variant="body1">
                    {selectedAnomaly.resolvedBy
                      ? typeof selectedAnomaly.resolvedBy === 'object'
                        ? selectedAnomaly.resolvedBy.username
                        : 'Unknown'
                      : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Resolved At
                  </Typography>
                  <Typography variant="body1">{formatDate(selectedAnomaly.resolvedAt)}</Typography>
                </Grid>
              </>
            )}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Created At
              </Typography>
              <Typography variant="body1">{formatDate(selectedAnomaly?.createdAt)}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Updated At
              </Typography>
              <Typography variant="body1">{formatDate(selectedAnomaly?.updatedAt)}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={resolveDialogOpen}
        title="Resolve Anomaly"
        message="Are you sure you want to mark this anomaly as resolved?"
        confirmText="Resolve"
        cancelText="Cancel"
        onConfirm={handleResolveConfirm}
        onCancel={handleResolveCancel}
        confirmColor="success"
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Anomaly"
        message="Are you sure you want to delete this anomaly? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmColor="error"
      />
    </Box>
  );
};

export default AnomalyDetail;
