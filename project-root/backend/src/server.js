const express = require('express');
const app = express();
const errorHandler = require('./middlewares/errorMiddleware'); // Import errorMiddleware

// Your route imports
const authRouter = require('./routes/authRouter');
const endpointRouter = require('./routes/endpointRouter');
const firewallRouter = require('./routes/firewallRouter');
const trafficRouter = require('./routes/trafficRouter');
const applicationRouter = require('./routes/applicationRouter');

// Middleware setup
app.use(express.json()); // To parse JSON bodies

// Route setup
app.use('/auth', authRouter);
app.use('/endpoints', endpointRouter);
app.use('/firewall', firewallRouter);
app.use('/traffic', trafficRouter);
app.use('/applications', applicationRouter);

// Use the error handling middleware at the end of all routes and middleware
app.use(errorHandler);

module.exports = app;
