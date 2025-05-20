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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '../../store/store';
import { fetchApplicationById } from '../../store/slices/applicationSlice';
import {
  fetchFirewallRulesByApplication,
  deleteFirewallRule
} from '../../store/slices/firewallSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import ConfirmDialog from '../common/ConfirmDialog';
import PageHeader from '../common/PageHeader';

const ApplicationFirewallRules: React.FC = () => {
  const { id: applicationId } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { selectedApplication, loading: appLoading, error: appError } =
    useSelector((state: RootState) => state.applications);
  const { rules, loading: rulesLoading, error: rulesError } =
    useSelector((state: RootState) => state.firewall);

  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (applicationId) {
      dispatch(fetchApplicationById(applicationId));
      dispatch(fetchFirewallRulesByApplication(applicationId));
    }
  }, [dispatch, applicationId]);

  const handleAddRule = () => {
    navigate(`/firewall/create?applicationId=${applicationId}`);
  };

  const handleEditRule = (ruleId: string) => {
    navigate(`/firewall/edit/${ruleId}`);
  };

  const handleDeleteClick = (ruleId: string) => {
    setRuleToDelete(ruleId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (ruleToDelete) {
      dispatch(deleteFirewallRule(ruleToDelete));
      setDeleteDialogOpen(false);
      setRuleToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setRuleToDelete(null);
  };

  const handleRefresh = () => {
    if (applicationId) {
      dispatch(fetchFirewallRulesByApplication(applicationId));
    }
  };

  const loading = appLoading || rulesLoading;
  const error = appError || rulesError;

  if (loading && !selectedApplication) {
    return <LoadingSpinner message="Loading application data..." />;
  }

  return (
    <Box>
      <PageHeader
        title="Application Firewall Rules"
        subtitle={`Manage firewall rules for application: ${selectedApplication?.name || 'Loading...'}`}
        action={{
          label: 'Back to Applications',
          onClick: () => navigate('/applications'),
          icon: <ArrowBackIcon />,
        }}
        secondaryAction={{
          label: 'Add Rule',
          onClick: handleAddRule,
          icon: <AddIcon />,
        }}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Applications', path: '/applications' },
          { label: 'Firewall Rules' },
        ]}
      />

      {error && <ErrorAlert message={error} onRetry={handleRefresh} />}

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Firewall Rules</Typography>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {rules.length === 0 ? (
            <Box textAlign="center" py={4}>
              <SecurityIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No Firewall Rules
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                This application doesn't have any firewall rules yet.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddRule}
              >
                Add First Rule
              </Button>
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Protocol</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Destination</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule._id}>
                      <TableCell>{rule.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={rule.action}
                          color={rule.action === 'ALLOW' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{rule.protocol}</TableCell>
                      <TableCell>
                        {rule.sourceIp && (
                          <Typography variant="body2">IP: {rule.sourceIp}</Typography>
                        )}
                        {rule.sourcePort && (
                          <Typography variant="body2">Port: {rule.sourcePort}</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {rule.destinationIp && (
                          <Typography variant="body2">IP: {rule.destinationIp}</Typography>
                        )}
                        {rule.destinationPort && (
                          <Typography variant="body2">Port: {rule.destinationPort}</Typography>
                        )}
                      </TableCell>
                      <TableCell>{rule.priority}</TableCell>
                      <TableCell>
                        <Chip
                          label={rule.enabled ? 'Enabled' : 'Disabled'}
                          color={rule.enabled ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit Rule">
                          <IconButton
                            color="primary"
                            onClick={() => handleEditRule(rule._id)}
                            disabled={loading}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Rule">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(rule._id)}
                            disabled={loading}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirm Deletion"
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

export default ApplicationFirewallRules;
