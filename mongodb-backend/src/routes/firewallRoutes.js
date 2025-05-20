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

router.route('/rules/batch')
  .post(firewallController.batchCreateRules)
  .put(firewallController.batchUpdateRules)
  .delete(firewallController.batchDeleteRules);

router.route('/rules/:id')
  .get(firewallController.getRuleById)
  .put(firewallController.updateRule)
  .delete(firewallController.deleteRule);

router.get('/rules/application/:applicationId', firewallController.getRulesByApplication);

module.exports = router;
