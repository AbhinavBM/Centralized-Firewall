import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '../../store/store';
import { 
  fetchFirewallRulesByEndpoint, 
  deleteFirewallRule,
  clearFirewallError 
} from '../../store/slices/firewallSlice';
import { fetchEndpointById } from '../../store/slices/endpointSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import PageHeader from '../common/PageHeader';
import ConfirmDialog from '../common/ConfirmDialog';

const EndpointFirewallRules: React.FC = () => {
  const { endpointId } = useParams<{ endpointId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Redux state
  const { rules, loading: rulesLoading, error: rulesError } = useSelector((state: RootState) => state.firewall);
  const { selectedEndpoint, loading: endpointLoading } = useSelector((state: RootState) => state.endpoints);

  // Local state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    if (endpointId) {
      dispatch(fetchEndpointById(endpointId));
      dispatch(fetchFirewallRulesByEndpoint(endpointId));
    }
  }, [dispatch, endpointId]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearFirewallError());
    };
  }, [dispatch]);

  // Event handlers
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddRule = () => {
    navigate(`/firewall/create?endpointId=${endpointId}`);
  };

  const handleViewRule = (ruleId: string) => {
    navigate(`/firewall/${ruleId}`);
  };

  const handleEditRule = (ruleId: string) => {
    navigate(`/firewall/edit/${ruleId}`);
  };

  const handleDeleteClick = (ruleId: string) => {
    setRuleToDelete(ruleId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (ruleToDelete) {
      await dispatch(deleteFirewallRule(ruleToDelete));
      setDeleteDialogOpen(false);
      setRuleToDelete(null);
      // Refresh the rules list
      if (endpointId) {
        dispatch(fetchFirewallRulesByEndpoint(endpointId));
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setRuleToDelete(null);
  };

  const handleRefresh = () => {
    if (endpointId) {
      dispatch(fetchFirewallRulesByEndpoint(endpointId));
      dispatch(fetchEndpointById(endpointId));
    }
  };

  const loading = rulesLoading || endpointLoading;

  return (
    <Box>
      <PageHeader
        title={`Firewall Rules - ${selectedEndpoint?.hostname || 'Endpoint'}`}
        subtitle={`Manage firewall rules for endpoint: ${selectedEndpoint?.ipAddress || endpointId}`}
        action={{
          label: 'Add Rule',
          onClick: handleAddRule,
          icon: <AddIcon />,
        }}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Endpoints', path: '/endpoints' },
          { label: selectedEndpoint?.hostname || 'Endpoint', path: `/endpoints/${endpointId}` },
          { label: 'Firewall Rules' },
        ]}
      />

      {rulesError && <ErrorAlert message={rulesError} onRetry={handleRefresh} />}

      {/* Endpoint Info Card */}
      {selectedEndpoint && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <SecurityIcon color="primary" />
              <Typography variant="h6">Endpoint Information</Typography>
            </Box>
            <Box display="flex" gap={4}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Hostname</Typography>
                <Typography variant="body1">{selectedEndpoint.hostname}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">IP Address</Typography>
                <Typography variant="body1">{selectedEndpoint.ipAddress}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip 
                  label={selectedEndpoint.status.toUpperCase()} 
                  color={selectedEndpoint.status === 'online' ? 'success' : 'default'}
                  size="small"
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Endpoint ID</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {endpointId}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Firewall Rules Table */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Firewall Rules ({rules.length})
            </Typography>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {loading && <LoadingSpinner />}

          {!loading && rules.length === 0 ? (
            <Box textAlign="center" py={4}>
              <SecurityIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No Firewall Rules Found
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                This endpoint doesn't have any firewall rules configured yet.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddRule}
              >
                Create First Rule
              </Button>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="firewall rules table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Entity Type</TableCell>
                      <TableCell>Source</TableCell>
                      <TableCell>Destination</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rules
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((rule) => (
                        <TableRow
                          key={rule._id}
                          hover
                          onClick={() => handleViewRule(rule._id)}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {rule.name || 'Unnamed Rule'}
                            </Typography>
                            {rule.description && (
                              <Typography variant="caption" color="text.secondary">
                                {rule.description}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={rule.entity_type || 'ip'}
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {rule.entity_type === 'domain' ? (
                              <Typography variant="body2">{rule.domain_name || 'Any'}</Typography>
                            ) : (
                              <Typography variant="body2">
                                {rule.source_ip || 'Any'}
                                {rule.source_port && `:${rule.source_port}`}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {rule.entity_type === 'domain' ? (
                              <Typography variant="body2">-</Typography>
                            ) : (
                              <Typography variant="body2">
                                {rule.destination_ip || 'Any'}
                                {rule.destination_port && `:${rule.destination_port}`}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={rule.action}
                              color={rule.action === 'allow' || rule.action === 'ALLOW' ? 'success' : 'error'}
                              size="small"
                            />
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
                            <Tooltip title="View">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewRule(rule._id);
                                }}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditRule(rule._id);
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(rule._id);
                                }}
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
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rules.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
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

export default EndpointFirewallRules;
