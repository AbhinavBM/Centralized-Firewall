import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '../../store/store';
import { fetchEndpoints, deleteEndpoint } from '../../store/slices/endpointSlice';
import StatusChip from '../common/StatusChip';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import ConfirmDialog from '../common/ConfirmDialog';
import PageHeader from '../common/PageHeader';

const EndpointList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { endpoints, loading, error } = useSelector((state: RootState) => state.endpoints);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [endpointToDelete, setEndpointToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchEndpoints());
  }, [dispatch]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddEndpoint = () => {
    navigate('/endpoints/create');
  };

  const handleEditEndpoint = (id: string) => {
    navigate(`/endpoints/edit/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setEndpointToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (endpointToDelete) {
      dispatch(deleteEndpoint(endpointToDelete));
      setDeleteDialogOpen(false);
      setEndpointToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEndpointToDelete(null);
  };

  const handleRefresh = () => {
    dispatch(fetchEndpoints());
  };

  if (loading && endpoints.length === 0) {
    return <LoadingSpinner message="Loading endpoints..." />;
  }

  return (
    <Box>
      <PageHeader
        title="Endpoints"
        subtitle="Manage your network endpoints"
        action={{
          label: 'Add Endpoint',
          onClick: handleAddEndpoint,
          icon: <AddIcon />,
        }}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Endpoints' },
        ]}
      />

      {error && <ErrorAlert message={error} onRetry={handleRefresh} />}

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Endpoint List</Typography>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {loading && <LoadingSpinner />}

          {!loading && endpoints.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                No endpoints found. Click "Add Endpoint" to create one.
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="endpoints table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Hostname</TableCell>
                      <TableCell>IP Address</TableCell>
                      <TableCell>OS</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Last Heartbeat</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {endpoints
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((endpoint) => (
                        <TableRow key={endpoint._id} hover>
                          <TableCell>{endpoint.hostname}</TableCell>
                          <TableCell>{endpoint.ipAddress}</TableCell>
                          <TableCell>{endpoint.os || 'N/A'}</TableCell>
                          <TableCell>
                            <StatusChip
                              status={endpoint.status}
                              statusMap={{
                                online: { label: 'Online', color: 'success' },
                                offline: { label: 'Offline', color: 'error' },
                                pending: { label: 'Pending', color: 'warning' },
                                error: { label: 'Error', color: 'error' },
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {endpoint.lastHeartbeat
                              ? new Date(endpoint.lastHeartbeat).toLocaleString()
                              : 'Never'}
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Edit">
                              <IconButton
                                onClick={() => handleEditEndpoint(endpoint._id)}
                                size="small"
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                onClick={() => handleDeleteClick(endpoint._id)}
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
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={endpoints.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </CardContent>
      </Card>

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

export default EndpointList;
