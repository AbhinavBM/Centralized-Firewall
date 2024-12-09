const express = require('express');
const router = express.Router();
const LogsController = require('../controllers/LogsController');

// Routes
router.post('/', LogsController.createLog); // Create a new log
router.get('/', LogsController.getAllLogs); // Get all logs with pagination and filtering
router.get('/endpoint/:id', LogsController.getLogsByEndpoint); // Get logs by endpoint_id
router.put('/:id', LogsController.updateLogById); // Update a log by ID
router.delete('/:id', LogsController.deleteLogById); // Delete a log by ID
router.get('/date-range', LogsController.getLogsByDateRange); // Get logs in a date range

module.exports = router;
