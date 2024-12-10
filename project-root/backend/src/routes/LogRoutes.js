const express = require('express');
const logController = require('../controllers/LogsController');

const router = express.Router();

// Define routes for logs
router.get('/logs', logController.getLogs);
router.get('/logs/search', logController.searchLogs);
router.get('/logs/date-range', logController.getLogsByDateRange);
router.get('/logs/application', logController.getLogsByApplication);
router.get('/logs/protocol', logController.getLogsByProtocol);
router.get('/logs/endpoint/:endpointId', logController.getLogsByEndpoint);

module.exports = router;
