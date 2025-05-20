import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrafficData } from '../../types/dashboard.types';

interface TrafficChartProps {
  data?: TrafficData[];
}

const TrafficChart: React.FC<TrafficChartProps> = ({ data }) => {
  // Check if data exists and format dates for better display
  const formattedData = data && data.length > 0
    ? data.map((item) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString(),
      }))
    : [];

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Traffic Overview
        </Typography>
        <Box sx={{ height: 300 }}>
          {!data || data.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Typography variant="body2" color="text.secondary">
                No traffic data available
              </Typography>
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formattedData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="allowed" name="Allowed Traffic" fill="#4caf50" />
                <Bar dataKey="blocked" name="Blocked Traffic" fill="#f44336" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TrafficChart;
