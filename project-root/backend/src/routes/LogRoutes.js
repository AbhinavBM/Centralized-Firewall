const express = require('express');
const router = express.Router();
const logController = require('../controllers/LogsController'); // Adjust path to your log controller

// Get all logs with pagination and filtering
router.get('/', logController.getLogs);

// Search logs based on a query
router.get('/search', logController.searchLogs);

// Get logs by date range
router.get('/date-range', logController.getLogsByDateRange);

// Get logs by protocol
router.get('/protocol', logController.getLogsByProtocol);

// Create a new log entry
router.post('/logs', logController.createLog);

module.exports = router;
