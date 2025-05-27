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
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '../../store/store';
import { fetchEndpoints } from '../../store/slices/endpointSlice';
import { fetchApplications } from '../../store/slices/applicationSlice';
import {
  fetchMappingsByEndpoint,
  createMapping,
  deleteMapping
} from '../../store/slices/mappingSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import ConfirmDialog from '../common/ConfirmDialog';
import PageHeader from '../common/PageHeader';

const EndpointApplicationMapping: React.FC = () => {
  const { id: endpointId } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { endpoints, selectedEndpoint, loading: endpointsLoading, error: endpointsError } =
    useSelector((state: RootState) => state.endpoints);
  const { applications, loading: applicationsLoading, error: applicationsError } =
    useSelector((state: RootState) => state.applications);
  const { mappings, loading: mappingsLoading, error: mappingsError } =
    useSelector((state: RootState) => state.mappings);

  const [selectedApplicationId, setSelectedApplicationId] = useState<string>('');
  const [mappingToDelete, setMappingToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (endpointId) {
      dispatch(fetchEndpoints());
      dispatch(fetchApplications());
      dispatch(fetchMappingsByEndpoint(endpointId));
    }
  }, [dispatch, endpointId]);

  const handleAddMapping = () => {
    if (endpointId && selectedApplicationId) {
      dispatch(createMapping({
        endpointId,
        applicationId: selectedApplicationId,
        status: 'active'
      }));
      setSelectedApplicationId('');
    }
  };

  const handleDeleteClick = (mappingId: string) => {
    setMappingToDelete(mappingId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (mappingToDelete) {
      dispatch(deleteMapping(mappingToDelete));
      setDeleteDialogOpen(false);
      setMappingToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setMappingToDelete(null);
  };

  const handleRefresh = () => {
    if (endpointId) {
      dispatch(fetchMappingsByEndpoint(endpointId));
    }
  };

  const loading = endpointsLoading || applicationsLoading || mappingsLoading;
  const error = endpointsError || applicationsError || mappingsError;

  // Filter out applications that are already mapped to this endpoint
  const availableApplications = applications.filter(app =>
    !mappings.some(mapping => mapping.applicationId === app._id)
  );

  if (loading && mappings.length === 0) {
    return <LoadingSpinner message="Loading mappings..." />;
  }

  return (
    <Box>
      <PageHeader
        title="Endpoint Application Mappings"
        subtitle={`Manage applications for endpoint: ${selectedEndpoint?.hostname || 'Loading...'}`}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Endpoints', path: '/endpoints' },
          { label: 'Application Mappings' },
        ]}
        action={{
          label: 'Back to Endpoints',
          onClick: () => navigate('/endpoints'),
          icon: <ArrowBackIcon />,
        }}
      />

      {error && <ErrorAlert message={error} onRetry={handleRefresh} />}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Mapped Applications</Typography>
                <Tooltip title="Refresh">
                  <IconButton onClick={handleRefresh} disabled={loading}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              {mappings.length === 0 ? (
                <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 4 }}>
                  No applications mapped to this endpoint yet.
                </Typography>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Application Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mappings.map((mapping) => {
                        // Check if applicationId is an object (populated) or a string (ID)
                        const applicationId = typeof mapping.applicationId === 'object' ? mapping.applicationId : mapping.applicationId;
                        // If it's an object, use it directly, otherwise find it in the applications array
                        const application = typeof mapping.applicationId === 'object' ? mapping.applicationId : applications.find(app => app._id === applicationId);
                        return (
                          <TableRow key={mapping._id}>
                            <TableCell>{application?.name || 'Unknown'}</TableCell>
                            <TableCell>
                              <Chip
                                label={mapping.status.toUpperCase()}
                                color={mapping.status === 'active' ? 'success' : 'default'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{application?.description || 'No description'}</TableCell>
                            <TableCell align="right">
                              <Tooltip title="Remove Mapping">
                                <IconButton
                                  color="error"
                                  onClick={() => handleDeleteClick(mapping._id)}
                                  disabled={loading}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Add Application to Endpoint
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <FormControl fullWidth>
                  <InputLabel id="application-select-label">Application</InputLabel>
                  <Select
                    labelId="application-select-label"
                    id="application-select"
                    value={selectedApplicationId}
                    label="Application"
                    onChange={(e) => setSelectedApplicationId(e.target.value as string)}
                    disabled={loading || availableApplications.length === 0}
                  >
                    {availableApplications.map((app) => (
                      <MenuItem key={app._id} value={app._id}>
                        {app.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddMapping}
                  disabled={loading || !selectedApplicationId}
                >
                  Add
                </Button>
              </Box>
              {availableApplications.length === 0 && (
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  All applications are already mapped to this endpoint.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirm Removal"
        message="Are you sure you want to remove this application mapping? This action cannot be undone."
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmColor="error"
      />
    </Box>
  );
};

export default EndpointApplicationMapping;
