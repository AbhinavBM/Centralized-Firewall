const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const errorHandler = require('./middlewares/errorMiddleware');
require('dotenv').config(); // Load environment variables

const requiredEnvVars = ['PORT', 'DB_HOST', 'DB_NAME', 'JWT_SECRET'];
requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        console.error(`Environment variable ${varName} is not set.`);
        process.exit(1); // Exit if missing
    }
});

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
const authRouter = require('./routes/authRoutes');
// const firewallRouter = require('./routes/firewallRoutes');
// Uncomment when routes are ready:
const endpointRouter = require('./routes/endpointRoutes');
// const trafficRouter = require('./routes/trafficRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

// Register Routes
app.use('/api/auth', authRouter);
// app.use('/firewall', firewallRouter);
app.use('/api/endpoints', endpointRouter);
// app.use('/traffic', trafficRouter);
// app.use('/applications', applicationRouter);
app.use('/api/applications', applicationRoutes);
// 404 handler for unmatched routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found.`,
    });
});

// Centralized error handling
app.use(errorHandler);

module.exports = app;
