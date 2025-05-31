import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { AppDispatch, RootState } from '../../store/store';
import {
  createApplication,
  updateApplication,
  fetchApplicationById,
  clearSelectedApplication,
} from '../../store/slices/applicationSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import PageHeader from '../common/PageHeader';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  status: Yup.string()
    .required('Status is required')
    .oneOf(['running', 'stopped', 'pending', 'allowed', 'blocked', 'suspended'], 'Invalid status'),
  // NGFW fields
  endpointId: Yup.string(),
  processName: Yup.string(),
  associated_ips: Yup.array().of(Yup.object({
    source_ip: Yup.string(),
    destination_ip: Yup.string()
  })),
  source_ports: Yup.array().of(Yup.number()),
  destination_ports: Yup.array().of(Yup.number()),
  // Legacy fields
  allowedDomains: Yup.array().of(Yup.string()),
  allowedIps: Yup.array().of(Yup.string()),
  allowedProtocols: Yup.array().of(Yup.string()),
});

const ApplicationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selectedApplication, loading, error } = useSelector(
    (state: RootState) => state.applications
  );

  useEffect(() => {
    if (isEditMode && id) {
      dispatch(fetchApplicationById(id));
    }

    return () => {
      dispatch(clearSelectedApplication());
    };
  }, [dispatch, id, isEditMode]);

  const formik = useFormik({
    initialValues: {
      // NGFW fields
      endpointId: selectedApplication?.endpointId || '',
      processName: selectedApplication?.processName || '',
      associated_ips: selectedApplication?.associated_ips || [],
      source_ports: selectedApplication?.source_ports || [],
      destination_ports: selectedApplication?.destination_ports || [],
      // Common fields
      name: selectedApplication?.name || '',
      description: selectedApplication?.description || '',
      status: selectedApplication?.status || 'pending',
      // Legacy fields
      allowedDomains: selectedApplication?.allowedDomains || [],
      allowedIps: selectedApplication?.allowedIps || [],
      allowedProtocols: selectedApplication?.allowedProtocols || [],
      // Form helpers
      newDomain: '',
      newIp: '',
      newProtocol: '',
      newSourcePort: '',
      newDestinationPort: '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const {
        endpointId, processName, associated_ips, source_ports, destination_ports,
        name, description, status, allowedDomains, allowedIps, allowedProtocols
      } = values;

      const applicationData = {
        // NGFW fields
        ...(endpointId && { endpointId }),
        ...(processName && { processName }),
        ...(associated_ips.length > 0 && { associated_ips }),
        ...(source_ports.length > 0 && { source_ports }),
        ...(destination_ports.length > 0 && { destination_ports }),
        // Common fields
        name,
        description,
        status,
        // Legacy fields
        allowedDomains,
        allowedIps,
        allowedProtocols,
      };

      if (isEditMode && id) {
        await dispatch(updateApplication({ id, applicationData }));
      } else {
        await dispatch(createApplication(applicationData));
      }

      navigate('/applications');
    },
  });

  const handleCancel = () => {
    navigate('/applications');
  };

  const handleAddDomain = () => {
    if (formik.values.newDomain && !formik.values.allowedDomains.includes(formik.values.newDomain)) {
      formik.setFieldValue('allowedDomains', [
        ...formik.values.allowedDomains,
        formik.values.newDomain,
      ]);
      formik.setFieldValue('newDomain', '');
    }
  };

  const handleDeleteDomain = (domain: string) => {
    formik.setFieldValue(
      'allowedDomains',
      formik.values.allowedDomains.filter((d) => d !== domain)
    );
  };

  const handleAddIp = () => {
    if (formik.values.newIp && !formik.values.allowedIps.includes(formik.values.newIp)) {
      formik.setFieldValue('allowedIps', [...formik.values.allowedIps, formik.values.newIp]);
      formik.setFieldValue('newIp', '');
    }
  };

  const handleDeleteIp = (ip: string) => {
    formik.setFieldValue(
      'allowedIps',
      formik.values.allowedIps.filter((i) => i !== ip)
    );
  };

  const handleAddProtocol = () => {
    if (
      formik.values.newProtocol &&
      !formik.values.allowedProtocols.includes(formik.values.newProtocol)
    ) {
      formik.setFieldValue('allowedProtocols', [
        ...formik.values.allowedProtocols,
        formik.values.newProtocol,
      ]);
      formik.setFieldValue('newProtocol', '');
    }
  };

  const handleDeleteProtocol = (protocol: string) => {
    formik.setFieldValue(
      'allowedProtocols',
      formik.values.allowedProtocols.filter((p) => p !== protocol)
    );
  };

  if (loading && isEditMode && !selectedApplication) {
    return <LoadingSpinner message="Loading application data..." />;
  }

  return (
    <Box>
      <PageHeader
        title={isEditMode ? 'Edit Application' : 'Create Application'}
        subtitle={
          isEditMode ? 'Update application details' : 'Add a new application to your firewall'
        }
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Applications', path: '/applications' },
          { label: isEditMode ? 'Edit Application' : 'Create Application' },
        ]}
      />

      {error && <ErrorAlert message={error} />}

      <Card>
        <CardContent>
          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Application Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  disabled={loading}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  error={formik.touched.status && Boolean(formik.errors.status)}
                  disabled={loading}
                >
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    name="status"
                    value={formik.values.status}
                    label="Status"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="running">Running</MenuItem>
                    <MenuItem value="stopped">Stopped</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="allowed">Allowed</MenuItem>
                    <MenuItem value="blocked">Blocked</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                  </Select>
                  {formik.touched.status && formik.errors.status && (
                    <FormHelperText>{formik.errors.status}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Description"
                  multiline
                  rows={3}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  disabled={loading}
                  required
                />
              </Grid>

              {/* NGFW Fields */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="endpointId"
                  name="endpointId"
                  label="Endpoint ID (Optional)"
                  value={formik.values.endpointId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                  helperText="Leave empty for frontend-only applications"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="processName"
                  name="processName"
                  label="Process Name (Optional)"
                  value={formik.values.processName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                  helperText="Process name for NGFW applications"
                />
              </Grid>

              {/* Source Ports */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Source Ports
                </Typography>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <TextField
                    fullWidth
                    id="newSourcePort"
                    name="newSourcePort"
                    label="Add Source Port"
                    type="number"
                    value={formik.values.newSourcePort}
                    onChange={formik.handleChange}
                    disabled={loading}
                  />
                  <Button
                    variant="contained"
                    onClick={() => {
                      const port = parseInt(formik.values.newSourcePort);
                      if (port && !formik.values.source_ports.includes(port)) {
                        formik.setFieldValue('source_ports', [...formik.values.source_ports, port]);
                        formik.setFieldValue('newSourcePort', '');
                      }
                    }}
                    disabled={!formik.values.newSourcePort || loading}
                  >
                    Add
                  </Button>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {formik.values.source_ports.map((port) => (
                    <Chip
                      key={port}
                      label={port}
                      onDelete={() => {
                        formik.setFieldValue(
                          'source_ports',
                          formik.values.source_ports.filter((p) => p !== port)
                        );
                      }}
                      disabled={loading}
                    />
                  ))}
                  {formik.values.source_ports.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No source ports added yet
                    </Typography>
                  )}
                </Box>
              </Grid>

              {/* Destination Ports */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Destination Ports
                </Typography>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <TextField
                    fullWidth
                    id="newDestinationPort"
                    name="newDestinationPort"
                    label="Add Destination Port"
                    type="number"
                    value={formik.values.newDestinationPort}
                    onChange={formik.handleChange}
                    disabled={loading}
                  />
                  <Button
                    variant="contained"
                    onClick={() => {
                      const port = parseInt(formik.values.newDestinationPort);
                      if (port && !formik.values.destination_ports.includes(port)) {
                        formik.setFieldValue('destination_ports', [...formik.values.destination_ports, port]);
                        formik.setFieldValue('newDestinationPort', '');
                      }
                    }}
                    disabled={!formik.values.newDestinationPort || loading}
                  >
                    Add
                  </Button>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {formik.values.destination_ports.map((port) => (
                    <Chip
                      key={port}
                      label={port}
                      onDelete={() => {
                        formik.setFieldValue(
                          'destination_ports',
                          formik.values.destination_ports.filter((p) => p !== port)
                        );
                      }}
                      disabled={loading}
                    />
                  ))}
                  {formik.values.destination_ports.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No destination ports added yet
                    </Typography>
                  )}
                </Box>
              </Grid>

              {/* Allowed Domains */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Allowed Domains
                </Typography>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <TextField
                    fullWidth
                    id="newDomain"
                    name="newDomain"
                    label="Add Domain"
                    value={formik.values.newDomain}
                    onChange={formik.handleChange}
                    disabled={loading}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddDomain}
                    disabled={!formik.values.newDomain || loading}
                  >
                    Add
                  </Button>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {formik.values.allowedDomains.map((domain) => (
                    <Chip
                      key={domain}
                      label={domain}
                      onDelete={() => handleDeleteDomain(domain)}
                      disabled={loading}
                    />
                  ))}
                  {formik.values.allowedDomains.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No domains added yet
                    </Typography>
                  )}
                </Box>
              </Grid>

              {/* Allowed IPs */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Allowed IPs
                </Typography>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <TextField
                    fullWidth
                    id="newIp"
                    name="newIp"
                    label="Add IP Address"
                    value={formik.values.newIp}
                    onChange={formik.handleChange}
                    disabled={loading}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddIp}
                    disabled={!formik.values.newIp || loading}
                  >
                    Add
                  </Button>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {formik.values.allowedIps.map((ip) => (
                    <Chip
                      key={ip}
                      label={ip}
                      onDelete={() => handleDeleteIp(ip)}
                      disabled={loading}
                    />
                  ))}
                  {formik.values.allowedIps.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No IP addresses added yet
                    </Typography>
                  )}
                </Box>
              </Grid>

              {/* Allowed Protocols */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Allowed Protocols
                </Typography>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <TextField
                    fullWidth
                    id="newProtocol"
                    name="newProtocol"
                    label="Add Protocol"
                    value={formik.values.newProtocol}
                    onChange={formik.handleChange}
                    disabled={loading}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddProtocol}
                    disabled={!formik.values.newProtocol || loading}
                  >
                    Add
                  </Button>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {formik.values.allowedProtocols.map((protocol) => (
                    <Chip
                      key={protocol}
                      label={protocol}
                      onDelete={() => handleDeleteProtocol(protocol)}
                      disabled={loading}
                    />
                  ))}
                  {formik.values.allowedProtocols.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No protocols added yet
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading || !formik.isValid}
                  >
                    {loading ? (
                      <LoadingSpinner />
                    ) : isEditMode ? (
                      'Update Application'
                    ) : (
                      'Create Application'
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ApplicationForm;
