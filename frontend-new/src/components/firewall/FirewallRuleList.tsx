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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '../../store/store';
import { fetchFirewallRules, deleteFirewallRule } from '../../store/slices/firewallSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import ConfirmDialog from '../common/ConfirmDialog';
import PageHeader from '../common/PageHeader';

const FirewallRuleList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { rules, loading, error } = useSelector((state: RootState) => state.firewall);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchFirewallRules());
  }, [dispatch]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddRule = () => {
    navigate('/firewall/create');
  };

  const handleEditRule = (id: string) => {
    navigate(`/firewall/edit/${id}`);
  };

  const handleViewRule = (id: string) => {
    navigate(`/firewall/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setRuleToDelete(id);
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
    dispatch(fetchFirewallRules());
  };

  if (loading && rules.length === 0) {
    return <LoadingSpinner message="Loading firewall rules..." />;
  }

  return (
    <Box>
      <PageHeader
        title="Firewall Rules"
        subtitle="Manage your network firewall rules"
        action={{
          label: 'Add Rule',
          onClick: handleAddRule,
          icon: <AddIcon />,
        }}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Firewall Rules' },
        ]}
      />

      {error && <ErrorAlert message={error} onRetry={handleRefresh} />}

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Firewall Rules</Typography>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {loading && <LoadingSpinner />}

          {!loading && rules.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                No firewall rules found. Click "Add Rule" to create one.
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="firewall rules table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Application</TableCell>
                      <TableCell>Protocol</TableCell>
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
                          <TableCell>{rule.name}</TableCell>
                          <TableCell>
                            {rule.applicationId && typeof rule.applicationId === 'object'
                              ? rule.applicationId.name
                              : 'N/A'}
                          </TableCell>
                          <TableCell>{rule.protocol}</TableCell>
                          <TableCell>
                            <Chip
                              label={rule.action}
                              color={rule.action === 'ALLOW' ? 'success' : 'error'}
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
                            <Tooltip title="Edit">
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditRule(rule._id);
                                }}
                                size="small"
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(rule._id);
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

export default FirewallRuleList;
