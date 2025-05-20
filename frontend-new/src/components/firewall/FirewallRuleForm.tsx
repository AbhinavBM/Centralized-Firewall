import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
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
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import PageHeader from '../common/PageHeader';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  applicationId: Yup.string().required('Application is required'),
  action: Yup.string()
    .required('Action is required')
    .oneOf(['ALLOW', 'DENY'], 'Invalid action'),
  protocol: Yup.string()
    .required('Protocol is required')
    .oneOf(['TCP', 'UDP', 'ICMP', 'ANY'], 'Invalid protocol'),
  priority: Yup.number()
    .required('Priority is required')
    .min(0, 'Priority must be at least 0'),
  sourceIp: Yup.string().nullable(),
  destinationIp: Yup.string().nullable(),
  sourcePort: Yup.number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .min(0, 'Source port must be at least 0')
    .max(65535, 'Source port must be at most 65535'),
  destinationPort: Yup.number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .min(0, 'Destination port must be at least 0')
    .max(65535, 'Destination port must be at most 65535'),
});

const FirewallRuleForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { selectedRule, loading: ruleLoading, error: ruleError } = useSelector(
    (state: RootState) => state.firewall
  );
  
  const { applications, loading: appsLoading, error: appsError } = useSelector(
    (state: RootState) => state.applications
  );

  useEffect(() => {
    dispatch(fetchApplications());

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
      applicationId: selectedRule?.applicationId?._id || selectedRule?.applicationId || '',
      sourceIp: selectedRule?.sourceIp || '',
      destinationIp: selectedRule?.destinationIp || '',
      sourcePort: selectedRule?.sourcePort || '',
      destinationPort: selectedRule?.destinationPort || '',
      protocol: selectedRule?.protocol || 'ANY',
      action: selectedRule?.action || 'ALLOW',
      priority: selectedRule?.priority || 0,
      enabled: selectedRule?.enabled !== undefined ? selectedRule.enabled : true,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const ruleData = {
        ...values,
        sourcePort: values.sourcePort ? Number(values.sourcePort) : null,
        destinationPort: values.destinationPort ? Number(values.destinationPort) : null,
        priority: Number(values.priority),
      };

      if (isEditMode && id) {
        await dispatch(updateFirewallRule({ id, ruleData }));
      } else {
        await dispatch(createFirewallRule(ruleData));
      }

      navigate('/firewall');
    },
  });

  const handleCancel = () => {
    navigate('/firewall');
  };

  const loading = ruleLoading || appsLoading;
  const error = ruleError || appsError;

  if (loading && isEditMode && !selectedRule) {
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
                <FormControl
                  fullWidth
                  error={formik.touched.applicationId && Boolean(formik.errors.applicationId)}
                  disabled={loading}
                  required
                >
                  <InputLabel id="applicationId-label">Application</InputLabel>
                  <Select
                    labelId="applicationId-label"
                    id="applicationId"
                    name="applicationId"
                    value={formik.values.applicationId}
                    label="Application"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {applications.map((app) => (
                      <MenuItem key={app._id} value={app._id}>
                        {app.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.applicationId && formik.errors.applicationId && (
                    <FormHelperText>{formik.errors.applicationId}</FormHelperText>
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
                  rows={2}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  error={formik.touched.action && Boolean(formik.errors.action)}
                  disabled={loading}
                  required
                >
                  <InputLabel id="action-label">Action</InputLabel>
                  <Select
                    labelId="action-label"
                    id="action"
                    name="action"
                    value={formik.values.action}
                    label="Action"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="ALLOW">Allow</MenuItem>
                    <MenuItem value="DENY">Deny</MenuItem>
                  </Select>
                  {formik.touched.action && formik.errors.action && (
                    <FormHelperText>{formik.errors.action}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  error={formik.touched.protocol && Boolean(formik.errors.protocol)}
                  disabled={loading}
                  required
                >
                  <InputLabel id="protocol-label">Protocol</InputLabel>
                  <Select
                    labelId="protocol-label"
                    id="protocol"
                    name="protocol"
                    value={formik.values.protocol}
                    label="Protocol"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="TCP">TCP</MenuItem>
                    <MenuItem value="UDP">UDP</MenuItem>
                    <MenuItem value="ICMP">ICMP</MenuItem>
                    <MenuItem value="ANY">ANY</MenuItem>
                  </Select>
                  {formik.touched.protocol && formik.errors.protocol && (
                    <FormHelperText>{formik.errors.protocol}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="sourceIp"
                  name="sourceIp"
                  label="Source IP"
                  value={formik.values.sourceIp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.sourceIp && Boolean(formik.errors.sourceIp)}
                  helperText={formik.touched.sourceIp && formik.errors.sourceIp}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="destinationIp"
                  name="destinationIp"
                  label="Destination IP"
                  value={formik.values.destinationIp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.destinationIp && Boolean(formik.errors.destinationIp)}
                  helperText={formik.touched.destinationIp && formik.errors.destinationIp}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="sourcePort"
                  name="sourcePort"
                  label="Source Port"
                  type="number"
                  value={formik.values.sourcePort}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.sourcePort && Boolean(formik.errors.sourcePort)}
                  helperText={formik.touched.sourcePort && formik.errors.sourcePort}
                  disabled={loading || formik.values.protocol === 'ICMP'}
                  InputProps={{ inputProps: { min: 0, max: 65535 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="destinationPort"
                  name="destinationPort"
                  label="Destination Port"
                  type="number"
                  value={formik.values.destinationPort}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.destinationPort && Boolean(formik.errors.destinationPort)}
                  helperText={formik.touched.destinationPort && formik.errors.destinationPort}
                  disabled={loading || formik.values.protocol === 'ICMP'}
                  InputProps={{ inputProps: { min: 0, max: 65535 } }}
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
                  disabled={loading}
                  InputProps={{ inputProps: { min: 0 } }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      id="enabled"
                      name="enabled"
                      checked={formik.values.enabled}
                      onChange={formik.handleChange}
                      disabled={loading}
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
