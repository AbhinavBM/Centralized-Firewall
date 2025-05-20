import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Tab,
  Tabs,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { AppDispatch, RootState } from '../../store/store';
import {
  fetchTrafficLogs,
  fetchSystemLogs,
  setPage,
  setLimit,
} from '../../store/slices/logSlice';
import { LogFilters } from '../../types/log.types';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import PageHeader from '../common/PageHeader';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`log-tabpanel-${index}`}
      aria-labelledby={`log-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const TrafficLogList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { trafficLogs, systemLogs, loading, error, pagination } = useSelector(
    (state: RootState) => state.logs
  );

  const [tabValue, setTabValue] = useState(0);
  const [trafficFilters, setTrafficFilters] = useState<LogFilters>({});
  const [systemFilters, setSystemFilters] = useState<LogFilters>({});

  useEffect(() => {
    if (tabValue === 0) {
      loadTrafficLogs();
    } else {
      loadSystemLogs();
    }
  }, [tabValue, pagination.page, pagination.limit]);

  const loadTrafficLogs = () => {
    dispatch(
      fetchTrafficLogs({
        page: pagination.page,
        limit: pagination.limit,
        filters: trafficFilters,
      })
    );
  };

  const loadSystemLogs = () => {
    dispatch(
      fetchSystemLogs({
        page: pagination.page,
        limit: pagination.limit,
        filters: systemFilters,
      })
    );
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    dispatch(setPage(1));
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    dispatch(setPage(newPage + 1));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setLimit(parseInt(event.target.value, 10)));
    dispatch(setPage(1));
  };

  const handleTrafficFilterChange = (name: keyof LogFilters, value: any) => {
    setTrafficFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSystemFilterChange = (name: keyof LogFilters, value: any) => {
    setSystemFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClearTrafficFilters = () => {
    setTrafficFilters({});
  };

  const handleClearSystemFilters = () => {
    setSystemFilters({});
  };

  const handleApplyTrafficFilters = () => {
    dispatch(setPage(1));
    loadTrafficLogs();
  };

  const handleApplySystemFilters = () => {
    dispatch(setPage(1));
    loadSystemLogs();
  };

  const handleRefresh = () => {
    if (tabValue === 0) {
      loadTrafficLogs();
    } else {
      loadSystemLogs();
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box>
      <PageHeader
        title="Logs"
        subtitle="View and analyze network traffic and system logs"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Logs' },
        ]}
      />

      {error && <ErrorAlert message={error} onRetry={handleRefresh} />}

      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="log tabs">
            <Tab label="Traffic Logs" id="log-tab-0" aria-controls="log-tabpanel-0" />
            <Tab label="System Logs" id="log-tab-1" aria-controls="log-tabpanel-1" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Traffic Log Filters
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="traffic-status-label">Status</InputLabel>
                  <Select
                    labelId="traffic-status-label"
                    id="traffic-status"
                    value={trafficFilters.status || ''}
                    label="Status"
                    onChange={(e) =>
                      handleTrafficFilterChange('status', e.target.value || undefined)
                    }
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="allowed">Allowed</MenuItem>
                    <MenuItem value="blocked">Blocked</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="traffic-type-label">Traffic Type</InputLabel>
                  <Select
                    labelId="traffic-type-label"
                    id="traffic-type"
                    value={trafficFilters.trafficType || ''}
                    label="Traffic Type"
                    onChange={(e) =>
                      handleTrafficFilterChange('trafficType', e.target.value || undefined)
                    }
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="inbound">Inbound</MenuItem>
                    <MenuItem value="outbound">Outbound</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="protocol-label">Protocol</InputLabel>
                  <Select
                    labelId="protocol-label"
                    id="protocol"
                    value={trafficFilters.protocol || ''}
                    label="Protocol"
                    onChange={(e) =>
                      handleTrafficFilterChange('protocol', e.target.value || undefined)
                    }
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="TCP">TCP</MenuItem>
                    <MenuItem value="UDP">UDP</MenuItem>
                    <MenuItem value="ICMP">ICMP</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  id="traffic-startDate"
                  label="Start Date"
                  type="date"
                  size="small"
                  value={trafficFilters.startDate || ''}
                  onChange={(e) =>
                    handleTrafficFilterChange('startDate', e.target.value || undefined)
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  id="traffic-endDate"
                  label="End Date"
                  type="date"
                  size="small"
                  value={trafficFilters.endDate || ''}
                  onChange={(e) => handleTrafficFilterChange('endDate', e.target.value || undefined)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} display="flex" justifyContent="flex-end">
                <Button variant="outlined" onClick={handleClearTrafficFilters} sx={{ mr: 1 }}>
                  Clear Filters
                </Button>
                <Button
                  variant="contained"
                  onClick={handleApplyTrafficFilters}
                  startIcon={<RefreshIcon />}
                >
                  Apply Filters
                </Button>
              </Grid>
            </Grid>
          </CardContent>

          <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Traffic Logs</Typography>
              <Tooltip title="Refresh">
                <IconButton onClick={loadTrafficLogs} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {loading && <LoadingSpinner />}

            {!loading && trafficLogs.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography variant="body1" color="text.secondary">
                  No traffic logs found with the current filters.
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="traffic logs table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>Source IP</TableCell>
                        <TableCell>Destination IP</TableCell>
                        <TableCell>Protocol</TableCell>
                        <TableCell>Traffic Type</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Data (KB)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {trafficLogs.map((log) => (
                        <TableRow key={log._id} hover>
                          <TableCell>{formatDate(log.timestamp)}</TableCell>
                          <TableCell>{log.sourceIp}</TableCell>
                          <TableCell>{log.destinationIp}</TableCell>
                          <TableCell>{log.protocol}</TableCell>
                          <TableCell>
                            <Chip
                              label={log.trafficType === 'inbound' ? 'Inbound' : 'Outbound'}
                              color={log.trafficType === 'inbound' ? 'info' : 'secondary'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={log.status === 'allowed' ? 'Allowed' : 'Blocked'}
                              color={log.status === 'allowed' ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{(log.dataTransferred / 1024).toFixed(2)}</TableCell>
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
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              System Log Filters
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="log-type-label">Log Type</InputLabel>
                  <Select
                    labelId="log-type-label"
                    id="log-type"
                    value={systemFilters.type || ''}
                    label="Log Type"
                    onChange={(e) => handleSystemFilterChange('type', e.target.value || undefined)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="system">System</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="firewall">Firewall</MenuItem>
                    <MenuItem value="endpoint">Endpoint</MenuItem>
                    <MenuItem value="application">Application</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="log-level-label">Level</InputLabel>
                  <Select
                    labelId="log-level-label"
                    id="log-level"
                    value={systemFilters.level || ''}
                    label="Level"
                    onChange={(e) => handleSystemFilterChange('level', e.target.value || undefined)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="info">Info</MenuItem>
                    <MenuItem value="warning">Warning</MenuItem>
                    <MenuItem value="error">Error</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  id="system-startDate"
                  label="Start Date"
                  type="date"
                  size="small"
                  value={systemFilters.startDate || ''}
                  onChange={(e) =>
                    handleSystemFilterChange('startDate', e.target.value || undefined)
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  id="system-endDate"
                  label="End Date"
                  type="date"
                  size="small"
                  value={systemFilters.endDate || ''}
                  onChange={(e) => handleSystemFilterChange('endDate', e.target.value || undefined)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} display="flex" justifyContent="flex-end">
                <Button variant="outlined" onClick={handleClearSystemFilters} sx={{ mr: 1 }}>
                  Clear Filters
                </Button>
                <Button
                  variant="contained"
                  onClick={handleApplySystemFilters}
                  startIcon={<RefreshIcon />}
                >
                  Apply Filters
                </Button>
              </Grid>
            </Grid>
          </CardContent>

          <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">System Logs</Typography>
              <Tooltip title="Refresh">
                <IconButton onClick={loadSystemLogs} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {loading && <LoadingSpinner />}

            {!loading && systemLogs.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography variant="body1" color="text.secondary">
                  No system logs found with the current filters.
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="system logs table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Level</TableCell>
                        <TableCell>Message</TableCell>
                        <TableCell>User</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {systemLogs.map((log) => (
                        <TableRow key={log._id} hover>
                          <TableCell>{formatDate(log.timestamp)}</TableCell>
                          <TableCell>
                            <Chip label={log.type} size="small" />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={log.level}
                              color={
                                log.level === 'critical' || log.level === 'error'
                                  ? 'error'
                                  : log.level === 'warning'
                                  ? 'warning'
                                  : 'info'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{log.message}</TableCell>
                          <TableCell>
                            {log.userId && typeof log.userId === 'object'
                              ? log.userId.username
                              : 'System'}
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
          </Box>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default TrafficLogList;
