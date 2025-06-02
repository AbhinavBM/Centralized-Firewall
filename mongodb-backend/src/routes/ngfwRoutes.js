const express = require('express');
const router = express.Router();
const ngfwController = require('../controllers/ngfwController');
const ngfwFirewallController = require('../controllers/ngfwFirewallController');
const ngfwLogsController = require('../controllers/ngfwLogsController');
const authMiddleware = require('../middlewares/authMiddleware');

// ===== PUBLIC ROUTES (No JWT required) =====
// These routes are used by NGFW endpoints for communication

// Endpoint authentication and application submission
router.post('/endpoints/authenticate', ngfwController.authenticateEndpoint);
router.post('/endpoints/applications', ngfwController.submitApplications);

// Firewall rules fetching (uses endpoint headers for auth)
router.get('/ngfw/firewall/rules', ngfwFirewallController.getEndpointRules);

// Logging endpoints
router.post('/logs', ngfwLogsController.createLog);
router.post('/logs/batch', ngfwLogsController.createBatchLogs);
router.get('/logs/stats', ngfwLogsController.getLogStats);

// ===== PROTECTED ROUTES (JWT required) =====
// These routes are for admin management of NGFW rules

// Protect admin routes
router.use(authMiddleware.protect);

// Admin firewall rule management
router.post('/ngfw/firewall/rules', ngfwFirewallController.createEndpointRule);

module.exports = router;
