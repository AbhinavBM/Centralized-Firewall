import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { AppDispatch, RootState } from '../../store/store';
import {
  createFirewallRule,
  updateFirewallRule,
  fetchFirewallRuleById,
  clearSelectedRule,
} from '../../store/slices/firewallSlice';
import { fetchApplications } from '../../store/slices/applicationSlice';
import { fetchEndpoints } from '../../store/slices/endpointSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import PageHeader from '../common/PageHeader';

const validationSchema = Yup.object({
  name: Yup.string().required('Rule name is required'),
  action: Yup.string().required('Action is required'),
  priority: Yup.number().required('Priority is required').min(0, 'Priority must be at least 0'),
  entity_type: Yup.string().oneOf(['ip', 'domain'], 'Invalid entity type'),
  source_port: Yup.number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .min(0, 'Source port must be at least 0')
    .max(65535, 'Source port must be at most 65535'),
  destination_port: Yup.number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .min(0, 'Destination port must be at least 0')
    .max(65535, 'Destination port must be at most 65535'),
  domain_name: Yup.string().when('entity_type', {
    is: 'domain',
    then: (schema) => schema.required('Domain is required'),
    otherwise: (schema) => schema.nullable(),
  }),
});

const FirewallRuleForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  // Get applicationId from query parameters
  const searchParams = new URLSearchParams(location.search);
  const applicationIdFromQuery = searchParams.get('applicationId');

  const { selectedRule, loading, error } = useSelector((state: RootState) => state.firewall);
  const { applications, loading: appsLoading } = useSelector((state: RootState) => state.applications);
  const { endpoints, loading: endpointsLoading } = useSelector((state: RootState) => state.endpoints);

  useEffect(() => {
    dispatch(fetchApplications());
    dispatch(fetchEndpoints());

    if (isEditMode && id) {
      dispatch(fetchFirewallRuleById(id));
    }

    return () => {
      dispatch(clearSelectedRule());
    };
  }, [dispatch, id, isEditMode]);

  const formik = useFormik({
    initialValues: {
      name: selectedRule?.name || '',
      description: selectedRule?.description || '',
      action: selectedRule?.action || 'allow',
      priority: selectedRule?.priority || 0,
      enabled: selectedRule?.enabled !== undefined ? selectedRule.enabled : true,
      // NGFW fields
      endpointId: typeof selectedRule?.endpointId === 'object'
        ? (selectedRule.endpointId as any)?._id
        : selectedRule?.endpointId || '',
      applicationId: typeof selectedRule?.applicationId === 'object'
        ? (selectedRule.applicationId as any)?._id
        : selectedRule?.applicationId || applicationIdFromQuery || '',
      processName: selectedRule?.processName || '',
      entity_type: selectedRule?.entity_type || 'ip',
      source_ip: selectedRule?.source_ip || '',
      destination_ip: selectedRule?.destination_ip || '',
      source_port: selectedRule?.source_port || '',
      destination_port: selectedRule?.destination_port || '',
      domain_name: selectedRule?.domain_name || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const ruleData = {
        name: values.name,
        description: values.description,
        action: values.action as 'allow' | 'deny',
        priority: Number(values.priority),
        enabled: values.enabled,
        // NGFW fields
        ...(values.endpointId && { endpointId: values.endpointId }),
        ...(values.applicationId && { applicationId: values.applicationId }),
        ...(values.processName && { processName: values.processName }),
        entity_type: values.entity_type,
        ...(values.entity_type === 'ip' && {
          source_ip: values.source_ip || undefined,
          destination_ip: values.destination_ip || undefined,
          source_port: values.source_port ? Number(values.source_port) : undefined,
          destination_port: values.destination_port ? Number(values.destination_port) : undefined,
        }),
        ...(values.entity_type === 'domain' && {
          domain_name: values.domain_name || undefined,
        }),
      };

      if (isEditMode && id) {
        await dispatch(updateFirewallRule({ id, ruleData }));
      } else {
        await dispatch(createFirewallRule(ruleData));
      }

      // Navigate back to application firewall rules if we came from there
      if (applicationIdFromQuery) {
        navigate(`/applications/${applicationIdFromQuery}/firewall-rules`);
      } else {
        navigate('/firewall');
      }
    },
  });

  const handleCancel = () => {
    // Navigate back to application firewall rules if we came from there
    if (applicationIdFromQuery) {
      navigate(`/applications/${applicationIdFromQuery}/firewall-rules`);
    } else {
      navigate('/firewall');
    }
  };

  const isLoading = loading || appsLoading || endpointsLoading;

  if (isLoading && isEditMode && !selectedRule) {
    return <LoadingSpinner message="Loading firewall rule data..." />;
  }

  return (
    <Box>
      <PageHeader
        title={isEditMode ? 'Edit Firewall Rule' : 'Create Firewall Rule'}
        subtitle={
          isEditMode ? 'Update firewall rule details' : 'Add a new firewall rule to your network'
        }
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Firewall Rules', path: '/firewall' },
          { label: isEditMode ? 'Edit Rule' : 'Create Rule' },
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
                  label="Rule Name"
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
                <FormControl fullWidth disabled={loading} required>
                  <InputLabel id="action-label">Action</InputLabel>
                  <Select
                    labelId="action-label"
                    id="action"
                    name="action"
                    value={formik.values.action}
                    label="Action"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.action && Boolean(formik.errors.action)}
                  >
                    <MenuItem value="allow">Allow</MenuItem>
                    <MenuItem value="deny">Deny</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Description"
                  multiline
                  rows={2}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="priority"
                  name="priority"
                  label="Priority"
                  type="number"
                  value={formik.values.priority}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.priority && Boolean(formik.errors.priority)}
                  helperText={
                    (formik.touched.priority && formik.errors.priority) ||
                    'Lower values have higher priority'
                  }
                  disabled={isLoading}
                  InputProps={{ inputProps: { min: 0 } }}
                  required
                />
              </Grid>

              {/* NGFW Fields */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth disabled={isLoading}>
                  <InputLabel id="endpointId-label">Endpoint (Optional)</InputLabel>
                  <Select
                    labelId="endpointId-label"
                    id="endpointId"
                    name="endpointId"
                    value={formik.values.endpointId}
                    label="Endpoint (Optional)"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="">
                      <em>None (Frontend Rule)</em>
                    </MenuItem>
                    {endpoints.map((endpoint) => (
                      <MenuItem key={endpoint._id} value={endpoint._id}>
                        {endpoint.hostname} ({endpoint.ipAddress})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth disabled={isLoading}>
                  <InputLabel id="applicationId-label">Application (Optional)</InputLabel>
                  <Select
                    labelId="applicationId-label"
                    id="applicationId"
                    name="applicationId"
                    value={formik.values.applicationId}
                    label="Application (Optional)"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="">
                      <em>None (Standalone Rule)</em>
                    </MenuItem>
                    {applications.map((app) => (
                      <MenuItem key={app._id} value={app._id}>
                        {app.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                  disabled={isLoading}
                  helperText="Process name for NGFW rules"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth disabled={isLoading}>
                  <InputLabel id="entity_type-label">Entity Type</InputLabel>
                  <Select
                    labelId="entity_type-label"
                    id="entity_type"
                    name="entity_type"
                    value={formik.values.entity_type}
                    label="Entity Type"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.entity_type && Boolean(formik.errors.entity_type)}
                  >
                    <MenuItem value="ip">IP Address</MenuItem>
                    <MenuItem value="domain">Domain</MenuItem>
                  </Select>
                  {formik.touched.entity_type && formik.errors.entity_type && (
                    <FormHelperText error>{formik.errors.entity_type}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Conditional fields based on entity type */}
              {formik.values.entity_type === 'ip' && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="source_ip"
                      name="source_ip"
                      label="Source IP (Optional)"
                      value={formik.values.source_ip}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={isLoading}
                      placeholder="e.g., 192.168.1.1"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="destination_ip"
                      name="destination_ip"
                      label="Destination IP (Optional)"
                      value={formik.values.destination_ip}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={isLoading}
                      placeholder="e.g., 10.0.0.1"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="source_port"
                      name="source_port"
                      label="Source Port (Optional)"
                      type="number"
                      value={formik.values.source_port}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.source_port && Boolean(formik.errors.source_port)}
                      helperText={formik.touched.source_port && formik.errors.source_port}
                      disabled={isLoading}
                      InputProps={{ inputProps: { min: 0, max: 65535 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="destination_port"
                      name="destination_port"
                      label="Destination Port (Optional)"
                      type="number"
                      value={formik.values.destination_port}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.destination_port && Boolean(formik.errors.destination_port)}
                      helperText={formik.touched.destination_port && formik.errors.destination_port}
                      disabled={isLoading}
                      InputProps={{ inputProps: { min: 0, max: 65535 } }}
                    />
                  </Grid>
                </>
              )}

              {formik.values.entity_type === 'domain' && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="domain_name"
                    name="domain_name"
                    label="Domain Name"
                    value={formik.values.domain_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.domain_name && Boolean(formik.errors.domain_name)}
                    helperText={formik.touched.domain_name && formik.errors.domain_name}
                    disabled={isLoading}
                    placeholder="e.g., example.com"
                    required
                  />
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      id="enabled"
                      name="enabled"
                      checked={formik.values.enabled}
                      onChange={formik.handleChange}
                      disabled={isLoading}
                    />
                  }
                  label="Enabled"
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading || !formik.isValid}
                  >
                    {isLoading ? (
                      <LoadingSpinner />
                    ) : isEditMode ? (
                      'Update Rule'
                    ) : (
                      'Create Rule'
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

export default FirewallRuleForm;
