const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middlewares/authMiddleware'); // Import JWT middleware
const {
    createFirewallRule,
    updateFirewallRule,
    deleteFirewallRule,
    getFirewallRules,
} = require('../controllers/firewallController');

// Firewall rule routes with authentication middleware
router.post('/', createFirewallRule);        // Add a firewall rule
router.get('/', getFirewallRules);           // Fetch all firewall rules
router.put('/:id', updateFirewallRule);      // Update a firewall rule by ID
router.delete('/:id', deleteFirewallRule);   // Delete a firewall rule by ID

module.exports = router;
