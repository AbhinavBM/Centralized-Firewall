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
router.post('/', authenticateJWT, createFirewallRule);        // Add a firewall rule
router.get('/', authenticateJWT, getFirewallRules);           // Fetch all firewall rules
router.put('/:id', authenticateJWT, updateFirewallRule);      // Update a firewall rule by ID
router.delete('/:id', authenticateJWT, deleteFirewallRule);   // Delete a firewall rule by ID

module.exports = router;
