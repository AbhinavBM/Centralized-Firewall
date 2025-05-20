import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  Box,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { Anomaly } from '../../types/anomaly.types';

interface RecentAnomaliesProps {
  anomalies?: Anomaly[];
}

const RecentAnomalies: React.FC<RecentAnomaliesProps> = ({ anomalies }) => {
  const navigate = useNavigate();

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
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Recent Anomalies</Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate('/anomalies')}
          >
            View All
          </Button>
        </Box>
        {!anomalies || anomalies.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
            No recent anomalies detected
          </Typography>
        ) : (
          <List>
            {anomalies.slice(0, 5).map((anomaly) => (
              <ListItem
                key={anomaly._id}
                divider
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(`/anomalies/${anomaly._id}`)}
              >
                <ListItemIcon>
                  <WarningIcon color={getSeverityColor(anomaly.severity)} />
                </ListItemIcon>
                <ListItemText
                  primary={anomaly.anomalyType}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {formatDate(anomaly.timestamp)}
                      </Typography>
                      {anomaly.description && ` — ${anomaly.description}`}
                    </>
                  }
                />
                <Chip
                  label={anomaly.severity.toUpperCase()}
                  color={getSeverityColor(anomaly.severity)}
                  size="small"
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentAnomalies;
