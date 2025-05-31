import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { AppDispatch, RootState } from '../../store/store';
import {
  fetchFirewallRuleById,
  deleteFirewallRule,
  clearSelectedRule,
} from '../../store/slices/firewallSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import PageHeader from '../common/PageHeader';

const FirewallRuleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { selectedRule, loading, error } = useSelector((state: RootState) => state.firewall);

  useEffect(() => {
    if (id) {
      dispatch(fetchFirewallRuleById(id));
    }

    return () => {
      dispatch(clearSelectedRule());
    };
  }, [dispatch, id]);

  const handleEdit = () => {
    navigate(`/firewall/edit/${id}`);
  };

  const handleDelete = async () => {
    if (id && window.confirm('Are you sure you want to delete this firewall rule?')) {
      await dispatch(deleteFirewallRule(id));
      navigate('/firewall');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading firewall rule details..." />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (!selectedRule) {
    return (
      <Box>
        <Typography variant="h6">Firewall rule not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title={selectedRule.name || 'Firewall Rule Details'}
        subtitle="View firewall rule information"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Firewall Rules', path: '/firewall' },
          { label: 'Rule Details' },
        ]}
      />

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Rule Name
              </Typography>
              <Typography variant="body1" gutterBottom>
                {selectedRule.name || 'Unnamed Rule'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Action
              </Typography>
              <Box mt={1}>
                <Chip
                  label={selectedRule.action}
                  color={selectedRule.action === 'allow' || selectedRule.action === 'ALLOW' ? 'success' : 'error'}
                  size="small"
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Priority
              </Typography>
              <Typography variant="body1" gutterBottom>
                {selectedRule.priority}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Box mt={1}>
                <Chip
                  label={selectedRule.enabled ? 'Enabled' : 'Disabled'}
                  color={selectedRule.enabled ? 'success' : 'default'}
                  size="small"
                />
              </Box>
            </Grid>

            {/* NGFW Fields */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Endpoint
              </Typography>
              <Typography variant="body1" gutterBottom>
                {typeof selectedRule.endpointId === 'object' && selectedRule.endpointId
                  ? `${selectedRule.endpointId.hostname} (${selectedRule.endpointId.ipAddress})`
                  : selectedRule.endpointId
                  ? `Endpoint ID: ${selectedRule.endpointId}`
                  : 'Frontend Only'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Entity Type
              </Typography>
              <Box mt={1}>
                <Chip
                  label={selectedRule.entity_type || 'ip'}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Grid>
            {selectedRule.processName && (
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Process Name
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedRule.processName}
                </Typography>
              </Grid>
            )}
            {(selectedRule.entity_type === 'ip' || !selectedRule.entity_type) && (
              <>
                {selectedRule.source_ip && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Source IP
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedRule.source_ip}
                    </Typography>
                  </Grid>
                )}
                {selectedRule.destination_ip && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Destination IP
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedRule.destination_ip}
                    </Typography>
                  </Grid>
                )}
                {selectedRule.source_port && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Source Port
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedRule.source_port}
                    </Typography>
                  </Grid>
                )}
                {selectedRule.destination_port && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Destination Port
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedRule.destination_port}
                    </Typography>
                  </Grid>
                )}
              </>
            )}
            {selectedRule.entity_type === 'domain' && selectedRule.domain_name && (
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Domain Name
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedRule.domain_name}
                </Typography>
              </Grid>
            )}

            {selectedRule.description && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedRule.description}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Box display="flex" gap={2} mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                >
                  Edit Rule
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                >
                  Delete Rule
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FirewallRuleDetail;
