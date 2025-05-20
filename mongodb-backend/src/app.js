const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const errorHandler = require('./middlewares/errorMiddleware');
const { checkEnvVars } = require('./config/env');

// Load environment variables
require('dotenv').config();

// Check required environment variables
if (!checkEnvVars()) {
  process.exit(1);
}

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
const authRoutes = require('./routes/authRoutes');
const endpointRoutes = require('./routes/endpointRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const logRoutes = require('./routes/logRoutes');
const endpointMappingRoutes = require('./routes/endpointMappingRoutes');
const firewallRoutes = require('./routes/firewallRoutes');
const anomalyRoutes = require('./routes/anomalyRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/endpoints', endpointRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/mapping', endpointMappingRoutes);
app.use('/api/firewall', firewallRoutes);
app.use('/api/anomalies', anomalyRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`
  });
});

// Centralized error handling
app.use(errorHandler);

module.exports = app;
