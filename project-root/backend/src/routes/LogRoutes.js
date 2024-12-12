const express = require('express');
const router = express.Router();
const logsController = require('../controllers/LogsController');

// Route for fetching logs with pagination and filters
router.get('/', logsController.getLogs);

// Route for searching logs
router.get('/search', logsController.searchLogs);

// Route for filtering logs by date range
router.get('/date-range', logsController.getLogsByDateRange);

// Route for filtering logs by protocol
router.get('/protocol', logsController.getLogsByProtocol);

// Route for creating a new log entry
router.post('/', logsController.createLog);

module.exports = router;
