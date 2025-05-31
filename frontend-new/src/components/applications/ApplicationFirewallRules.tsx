import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
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
  Visibility as VisibilityIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '../../store/store';
import { fetchApplicationById } from '../../store/slices/applicationSlice';
import { fetchEndpoints } from '../../store/slices/endpointSlice';
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
  const { endpoints, loading: endpointsLoading } = useSelector((state: RootState) => state.endpoints);

  // State for filtering and pagination
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [endpointFilter, setEndpointFilter] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('');
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (applicationId) {
      dispatch(fetchApplicationById(applicationId));
      dispatch(fetchFirewallRulesByApplication(applicationId));
    }
    dispatch(fetchEndpoints());
  }, [dispatch, applicationId]);

  // Filter rules based on current filters
  const filteredRules = rules.filter((rule) => {
    const matchesSearch = !searchTerm ||
      rule.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEndpoint = !endpointFilter ||
      (typeof rule.endpointId === 'object' && rule.endpointId?.hostname === endpointFilter) ||
      (typeof rule.endpointId === 'string' && rule.endpointId === endpointFilter) ||
      (endpointFilter === 'frontend' && !rule.endpointId);

    const matchesAction = !actionFilter || rule.action?.toLowerCase() === actionFilter.toLowerCase();

    const matchesEntityType = !entityTypeFilter ||
      rule.entity_type === entityTypeFilter ||
      rule.entityType === entityTypeFilter;

    const matchesStatus = !statusFilter ||
      (statusFilter === 'enabled' && rule.enabled) ||
      (statusFilter === 'disabled' && !rule.enabled);

    return matchesSearch && matchesEndpoint && matchesAction && matchesEntityType && matchesStatus;
  });

  // Pagination handlers
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Action handlers
  const handleAddRule = () => {
    navigate(`/firewall/create?applicationId=${applicationId}`);
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

  const handleClearFilters = () => {
    setEndpointFilter('');
    setActionFilter('');
    setEntityTypeFilter('');
    setStatusFilter('');
    setSearchTerm('');
    setPage(0);
  };

  const loading = appLoading || rulesLoading || endpointsLoading;
  const error = appError || rulesError;

  // Get paginated rules
  const paginatedRules = filteredRules.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
            <Typography variant="h6">
              Firewall Rules ({filteredRules.length} of {rules.length})
            </Typography>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Filters */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Search Rules"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or description..."
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Endpoint</InputLabel>
                <Select
                  value={endpointFilter}
                  label="Endpoint"
                  onChange={(e) => setEndpointFilter(e.target.value)}
                >
                  <MenuItem value="">All Endpoints</MenuItem>
                  <MenuItem value="frontend">Frontend Only</MenuItem>
                  {endpoints.map((endpoint) => (
                    <MenuItem key={endpoint._id} value={endpoint.hostname}>
                      {endpoint.hostname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Action</InputLabel>
                <Select
                  value={actionFilter}
                  label="Action"
                  onChange={(e) => setActionFilter(e.target.value)}
                >
                  <MenuItem value="">All Actions</MenuItem>
                  <MenuItem value="allow">Allow</MenuItem>
                  <MenuItem value="deny">Deny</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Entity Type</InputLabel>
                <Select
                  value={entityTypeFilter}
                  label="Entity Type"
                  onChange={(e) => setEntityTypeFilter(e.target.value)}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="ip">IP Address</MenuItem>
                  <MenuItem value="domain">Domain</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="enabled">Enabled</MenuItem>
                  <MenuItem value="disabled">Disabled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClearFilters}
                startIcon={<FilterIcon />}
                size="small"
              >
                Clear
              </Button>
            </Grid>
          </Grid>

          {filteredRules.length === 0 ? (
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
                    <TableCell>Endpoint</TableCell>
                    <TableCell>Entity Type</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Target</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRules.map((rule) => (
                    <TableRow key={rule._id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {rule.name}
                        </Typography>
                        {rule.description && (
                          <Typography variant="caption" color="text.secondary">
                            {rule.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {typeof rule.endpointId === 'object' && rule.endpointId ? (
                          <Typography variant="body2">
                            {rule.endpointId.hostname}
                          </Typography>
                        ) : rule.endpointId ? (
                          <Typography variant="body2" color="text.secondary">
                            ID: {rule.endpointId}
                          </Typography>
                        ) : (
                          <Chip label="Frontend" variant="outlined" size="small" />
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
                        <Chip
                          label={rule.action}
                          color={rule.action === 'allow' || rule.action === 'ALLOW' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {rule.entity_type === 'domain' && rule.domain_name ? (
                          <Typography variant="body2">
                            Domain: {rule.domain_name}
                          </Typography>
                        ) : (
                          <>
                            {rule.source_ip && (
                              <Typography variant="body2">
                                Src: {rule.source_ip}
                                {rule.source_port && `:${rule.source_port}`}
                              </Typography>
                            )}
                            {rule.destination_ip && (
                              <Typography variant="body2">
                                Dst: {rule.destination_ip}
                                {rule.destination_port && `:${rule.destination_port}`}
                              </Typography>
                            )}
                            {!rule.source_ip && !rule.destination_ip && rule.destination_port && (
                              <Typography variant="body2">
                                Port: {rule.destination_port}
                              </Typography>
                            )}
                          </>
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
                        <Tooltip title="View Rule">
                          <IconButton
                            color="info"
                            onClick={() => handleViewRule(rule._id)}
                            disabled={loading}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
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

          {/* Pagination */}
          {filteredRules.length > 0 && (
            <TablePagination
              component="div"
              count={filteredRules.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
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
