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
  createEndpoint,
  updateEndpoint,
  fetchEndpointById,
  clearSelectedEndpoint,
} from '../../store/slices/endpointSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import PageHeader from '../common/PageHeader';

const validationSchema = Yup.object({
  hostname: Yup.string().required('Hostname is required'),
  ipAddress: Yup.string()
    .required('IP address is required')
    .matches(
      /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      'Invalid IP address format'
    ),
  os: Yup.string().nullable(),
  status: Yup.string()
    .required('Status is required')
    .oneOf(['online', 'offline', 'pending', 'error'], 'Invalid status'),
  password: Yup.string().test('conditional-required', 'Password is required', function(value) {
    // If isNew is true, password is required
    if (this.parent.isNew) {
      return !!value;
    }
    // Otherwise, it's optional
    return true;
  }),
});

const EndpointForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selectedEndpoint, loading, error } = useSelector((state: RootState) => state.endpoints);

  useEffect(() => {
    if (isEditMode && id) {
      dispatch(fetchEndpointById(id));
    }

    return () => {
      dispatch(clearSelectedEndpoint());
    };
  }, [dispatch, id, isEditMode]);

  const formik = useFormik({
    initialValues: {
      hostname: selectedEndpoint?.hostname || '',
      ipAddress: selectedEndpoint?.ipAddress || '',
      os: selectedEndpoint?.os || '',
      status: selectedEndpoint?.status || 'pending',
      password: '',
      isNew: !isEditMode,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const { hostname, ipAddress, os, status, password } = values;
      const endpointData = {
        hostname,
        ipAddress,
        os,
        status,
        ...(password && { password }),
      };

      if (isEditMode && id) {
        await dispatch(updateEndpoint({ id, endpointData }));
      } else {
        await dispatch(createEndpoint(endpointData));
      }

      navigate('/endpoints');
    },
  });

  const handleCancel = () => {
    navigate('/endpoints');
  };

  if (loading && isEditMode && !selectedEndpoint) {
    return <LoadingSpinner message="Loading endpoint data..." />;
  }

  return (
    <Box>
      <PageHeader
        title={isEditMode ? 'Edit Endpoint' : 'Create Endpoint'}
        subtitle={isEditMode ? 'Update endpoint details' : 'Add a new endpoint to your network'}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Endpoints', path: '/endpoints' },
          { label: isEditMode ? 'Edit Endpoint' : 'Create Endpoint' },
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
                  id="hostname"
                  name="hostname"
                  label="Hostname"
                  value={formik.values.hostname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.hostname && Boolean(formik.errors.hostname)}
                  helperText={formik.touched.hostname && formik.errors.hostname}
                  disabled={loading}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="ipAddress"
                  name="ipAddress"
                  label="IP Address"
                  value={formik.values.ipAddress}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.ipAddress && Boolean(formik.errors.ipAddress)}
                  helperText={formik.touched.ipAddress && formik.errors.ipAddress}
                  disabled={loading}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="os"
                  name="os"
                  label="Operating System"
                  value={formik.values.os}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.os && Boolean(formik.errors.os)}
                  helperText={formik.touched.os && formik.errors.os}
                  disabled={loading}
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
                    <MenuItem value="online">Online</MenuItem>
                    <MenuItem value="offline">Offline</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="error">Error</MenuItem>
                  </Select>
                  {formik.touched.status && formik.errors.status && (
                    <FormHelperText>{formik.errors.status}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label={isEditMode ? 'New Password (leave blank to keep current)' : 'Password'}
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  disabled={loading}
                  required={!isEditMode}
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
                      'Update Endpoint'
                    ) : (
                      'Create Endpoint'
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

export default EndpointForm;
