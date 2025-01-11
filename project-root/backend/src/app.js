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
const endpointRouter = require('./routes/endpointRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const logRoutes = require('./routes/LogRoutes'); // Import routes
const endpointRoutes = require('./EndpointRoutes/endpointRoutes');
const endpointMappingRoutes = require('./routes/endpointMappingRoutes');


app.use('/endpoint-verify',endpointRoutes)
// Register Routes
app.use('/api/mapping', endpointMappingRoutes); // Endpoint for mapping routes

app.use('/api/auth', authRouter);
app.use('/api/endpoints', endpointRouter);
app.use('/api/applications', applicationRoutes);
app.use('/api/logs', logRoutes); // Prefix all routes with /api
app.use('/api/mapping', endpointMappingRoutes); // Register routes under '/api'



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
