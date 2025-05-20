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
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '../../store/store';
import {
  fetchFirewallRuleById,
  deleteFirewallRule,
  clearSelectedRule,
} from '../../store/slices/firewallSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import ConfirmDialog from '../common/ConfirmDialog';
import PageHeader from '../common/PageHeader';

const FirewallRuleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selectedRule, loading, error } = useSelector((state: RootState) => state.firewall);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchFirewallRuleById(id));
    }

    return () => {
      dispatch(clearSelectedRule());
    };
  }, [dispatch, id]);

  const handleEditRule = () => {
    navigate(`/firewall/edit/${id}`);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (id) {
      dispatch(deleteFirewallRule(id));
      setDeleteDialogOpen(false);
      navigate('/firewall');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleRefresh = () => {
    if (id) {
      dispatch(fetchFirewallRuleById(id));
    }
  };

  if (loading && !selectedRule) {
    return <LoadingSpinner message="Loading firewall rule details..." />;
  }

  if (!selectedRule && !loading) {
    return (
      <Box>
        <PageHeader
          title="Firewall Rule Not Found"
          breadcrumbs={[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Firewall Rules', path: '/firewall' },
            { label: 'Rule Details' },
          ]}
        />
        <Card>
          <CardContent>
            <Typography>
              The firewall rule you are looking for does not exist or has been deleted.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/firewall')}
              sx={{ mt: 2 }}
            >
              Back to Firewall Rules
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title={`Firewall Rule: ${selectedRule?.name}`}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Firewall Rules', path: '/firewall' },
          { label: selectedRule?.name || 'Rule Details' },
        ]}
        action={{
          label: 'Edit Rule',
          onClick: handleEditRule,
          icon: <EditIcon />,
        }}
      />

      {error && <ErrorAlert message={error} onRetry={handleRefresh} />}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h6">Rule Details</Typography>
              <Chip
                label={selectedRule?.enabled ? 'Enabled' : 'Disabled'}
                color={selectedRule?.enabled ? 'success' : 'default'}
              />
              <Chip
                label={selectedRule?.action}
                color={selectedRule?.action === 'ALLOW' ? 'success' : 'error'}
              />
            </Box>
            <Box>
              <Tooltip title="Refresh">
                <IconButton onClick={handleRefresh} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton onClick={handleEditRule} disabled={loading}>
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
                Name
              </Typography>
              <Typography variant="body1">{selectedRule?.name}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Application
              </Typography>
              <Typography variant="body1">
                {selectedRule?.applicationId && typeof selectedRule.applicationId === 'object'
                  ? selectedRule.applicationId.name
                  : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Typography variant="body1">{selectedRule?.description || 'No description'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Protocol
              </Typography>
              <Typography variant="body1">{selectedRule?.protocol}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Priority
              </Typography>
              <Typography variant="body1">{selectedRule?.priority}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Source IP
              </Typography>
              <Typography variant="body1">{selectedRule?.sourceIp || 'Any'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Destination IP
              </Typography>
              <Typography variant="body1">{selectedRule?.destinationIp || 'Any'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Source Port
              </Typography>
              <Typography variant="body1">
                {selectedRule?.sourcePort !== null && selectedRule?.sourcePort !== undefined
                  ? selectedRule.sourcePort
                  : 'Any'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Destination Port
              </Typography>
              <Typography variant="body1">
                {selectedRule?.destinationPort !== null && selectedRule?.destinationPort !== undefined
                  ? selectedRule.destinationPort
                  : 'Any'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Created At
              </Typography>
              <Typography variant="body1">
                {selectedRule?.createdAt
                  ? new Date(selectedRule.createdAt).toLocaleString()
                  : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Updated At
              </Typography>
              <Typography variant="body1">
                {selectedRule?.updatedAt
                  ? new Date(selectedRule.updatedAt).toLocaleString()
                  : 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Firewall Rule"
        message="Are you sure you want to delete this firewall rule? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmColor="error"
      />
    </Box>
  );
};

export default FirewallRuleDetail;
