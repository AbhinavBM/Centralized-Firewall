const express = require('express');
const router = express.Router();
const firewallController = require('../controllers/firewallController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect all routes
router.use(authMiddleware.protect);

// Firewall rules routes
router.route('/rules')
  .get(firewallController.getAllRules)
  .post(firewallController.createRule);

// Specific routes MUST come before parameterized routes
// Statistics route
router.get('/rules/stats', firewallController.getFirewallStats);

// Application-specific rules
router.get('/rules/application/:applicationId', firewallController.getRulesByApplication);

// Endpoint-specific rules
router.get('/rules/endpoint/:endpointId', firewallController.getRulesByEndpoint);

// Batch operations
router.route('/rules/batch')
  .post(firewallController.batchCreateRules)
  .put(firewallController.batchUpdateRules)
  .delete(firewallController.batchDeleteRules);

// Parameterized routes MUST come last
router.route('/rules/:id')
  .get(firewallController.getRuleById)
  .put(firewallController.updateRule)
  .delete(firewallController.deleteRule);

module.exports = router;
