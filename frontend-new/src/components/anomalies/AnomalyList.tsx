import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
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
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextField,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '../../store/store';
import {
  fetchAnomalies,
  resolveAnomaly,
  deleteAnomaly,
  setPage,
  setLimit,
} from '../../store/slices/anomalySlice';
import { AnomalyFilters } from '../../types/anomaly.types';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import ConfirmDialog from '../common/ConfirmDialog';
import PageHeader from '../common/PageHeader';

const AnomalyList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { anomalies, loading, error, pagination } = useSelector(
    (state: RootState) => state.anomalies
  );

  const [filters, setFilters] = useState<AnomalyFilters>({
    resolved: false,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string | null>(null);

  useEffect(() => {
    loadAnomalies();
  }, [pagination.page, pagination.limit, filters]);

  const loadAnomalies = () => {
    dispatch(
      fetchAnomalies({
        page: pagination.page,
        limit: pagination.limit,
        filters,
      })
    );
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    dispatch(setPage(newPage + 1));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setLimit(parseInt(event.target.value, 10)));
    dispatch(setPage(1));
  };

  const handleViewAnomaly = (id: string) => {
    navigate(`/anomalies/${id}`);
  };

  const handleResolveClick = (id: string) => {
    setSelectedAnomalyId(id);
    setResolveDialogOpen(true);
  };

  const handleResolveConfirm = () => {
    if (selectedAnomalyId) {
      dispatch(resolveAnomaly(selectedAnomalyId));
      setResolveDialogOpen(false);
      setSelectedAnomalyId(null);
    }
  };

  const handleResolveCancel = () => {
    setResolveDialogOpen(false);
    setSelectedAnomalyId(null);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedAnomalyId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedAnomalyId) {
      dispatch(deleteAnomaly(selectedAnomalyId));
      setDeleteDialogOpen(false);
      setSelectedAnomalyId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedAnomalyId(null);
  };

  const handleRefresh = () => {
    loadAnomalies();
  };

  const handleFilterChange = (name: keyof AnomalyFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    dispatch(setPage(1));
  };

  const handleClearFilters = () => {
    setFilters({
      resolved: false,
    });
    dispatch(setPage(1));
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

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box>
      <PageHeader
        title="Anomalies"
        subtitle="Monitor and manage detected network anomalies"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Anomalies' },
        ]}
      />

      {error && <ErrorAlert message={error} onRetry={handleRefresh} />}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="severity-label">Severity</InputLabel>
                <Select
                  labelId="severity-label"
                  id="severity"
                  value={filters.severity || ''}
                  label="Severity"
                  onChange={(e) => handleFilterChange('severity', e.target.value || undefined)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="resolved-label">Status</InputLabel>
                <Select
                  labelId="resolved-label"
                  id="resolved"
                  value={filters.resolved === undefined ? '' : filters.resolved ? 'true' : 'false'}
                  label="Status"
                  onChange={(e) =>
                    handleFilterChange(
                      'resolved',
                      e.target.value === '' ? undefined : e.target.value === 'true'
                    )
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="false">Active</MenuItem>
                  <MenuItem value="true">Resolved</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                id="startDate"
                label="Start Date"
                type="date"
                size="small"
                value={filters.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                id="endDate"
                label="End Date"
                type="date"
                size="small"
                value={filters.endDate || ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value || undefined)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <Button variant="outlined" onClick={handleClearFilters} sx={{ mr: 1 }}>
                Clear Filters
              </Button>
              <Button variant="contained" onClick={handleRefresh} startIcon={<RefreshIcon />}>
                Refresh
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Anomaly List</Typography>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {loading && <LoadingSpinner />}

          {!loading && anomalies.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                No anomalies found with the current filters.
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="anomalies table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Endpoint</TableCell>
                      <TableCell>Severity</TableCell>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {anomalies.map((anomaly) => (
                      <TableRow
                        key={anomaly._id}
                        hover
                        onClick={() => handleViewAnomaly(anomaly._id)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>{anomaly.anomalyType}</TableCell>
                        <TableCell>
                          {typeof anomaly.endpointId === 'object'
                            ? anomaly.endpointId.hostname
                            : 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={anomaly.severity.toUpperCase()}
                            color={getSeverityColor(anomaly.severity)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatDate(anomaly.timestamp)}</TableCell>
                        <TableCell>
                          <Chip
                            label={anomaly.resolved ? 'Resolved' : 'Active'}
                            color={anomaly.resolved ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {!anomaly.resolved && (
                            <Tooltip title="Resolve">
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleResolveClick(anomaly._id);
                                }}
                                size="small"
                                color="success"
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(anomaly._id);
                              }}
                              size="small"
                              color="error"
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
                component="div"
                count={pagination.total}
                page={pagination.page - 1}
                rowsPerPage={pagination.limit}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </>
          )}
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

export default AnomalyList;
