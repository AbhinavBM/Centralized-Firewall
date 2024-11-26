const express = require('express');
const morgan = require('morgan'); // For logging
const helmet = require('helmet'); // For security headers
const cors = require('cors'); // For handling CORS
const errorHandler = require('./middlewares/errorMiddleware'); // Custom error handler
require('dotenv').config(); // Load environment variables

// Ensure required environment variables are loaded
const requiredEnvVars = ['PORT', 'DB_HOST', 'DB_NAME', 'JWT_SECRET'];
requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        console.error(`Environment variable ${varName} is not set.`);
        process.exit(1); // Exit if a required environment variable is missing
    }
});

// Initialize Express
const app = express();

// Middleware
app.use(helmet()); // Adds security headers to HTTP responses
app.use(cors()); // Enables CORS for cross-origin requests
app.use(morgan('dev')); // Logs requests in development mode
app.use(express.json()); // Parses incoming JSON payloads
app.use(express.urlencoded({ extended: false })); // Parses URL-encoded payloads

// Route Imports
const authRouter = require('./routes/authRoutes');
const firewallRouter = require('./routes/firewallRoutes');
// Uncomment and add routes as they are implemented
// const endpointRouter = require('./routes/endpointRoutes');
// const trafficRouter = require('./routes/trafficRoutes');
// const applicationRouter = require('./routes/applicationRoutes');

// Register Routes
app.use('/auth', authRouter); // Authentication routes
app.use('/firewall', firewallRouter); // Firewall-related routes
// app.use('/endpoints', endpointRouter);
// app.use('/traffic', trafficRouter);
// app.use('/applications', applicationRouter);

// Catch-all for unmatched routes (404 handler)
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found.`,
    });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Export the Express app
module.exports = app;
