const express = require('express');
const morgan = require('morgan'); // For logging
const helmet = require('helmet'); // For security headers
const cors = require('cors'); // For handling CORS
const errorHandler = require('./middlewares/errorMiddleware'); // Custom error handler
require('dotenv').config();

// Ensure required environment variables are loaded
const requiredEnvVars = ['PORT', 'DB_HOST', 'DB_NAME', 'JWT_SECRET'];
requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        console.error(`Environment variable ${varName} is not set.`);
        process.exit(1); // Exit if required environment variable is missing
    }
});

// Initialize Express
const app = express();

// Middleware
app.use(helmet()); // Adds security headers
app.use(cors()); // Enables CORS
app.use(morgan('dev')); // Logs requests in development
app.use(express.json()); // Parses JSON bodies

// Route Imports
const authRouter = require('./routes/authRouter');
const endpointRouter = require('./routes/endpointRouter');
const firewallRouter = require('./routes/firewallRouter');
const trafficRouter = require('./routes/trafficRouter');
const applicationRouter = require('./routes/applicationRouter');

// Routes
app.use('/auth', authRouter);
app.use('/endpoints', endpointRouter);
app.use('/firewall', firewallRouter);
app.use('/traffic', trafficRouter);
app.use('/applications', applicationRouter);

// Catch-all for unmatched routes (404 handler)
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found.`,
    });
});

// Error Handling Middleware
app.use(errorHandler);

// Export the app
module.exports = app;
