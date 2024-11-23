const FirewallRule = require('../models/FirewallRule');

// Create a new firewall rule
const createFirewallRule = async (req, res) => {
    const { endpoint_id, type, domain, ip_address, protocol } = req.body;

    try {
        // Validate required fields
        if (!endpoint_id || !type || !protocol) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create a new firewall rule
        const firewallRule = await FirewallRule.create({
            endpoint_id,
            type,
            domain,
            ip_address,
            protocol,
        });

        // Respond with the created firewall rule
        res.status(201).json(firewallRule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all firewall rules
const getFirewallRules = async (req, res) => {
    try {
        // Fetch all firewall rules
        const firewallRules = await FirewallRule.findAll();

        // Respond with the firewall rules
        res.status(200).json(firewallRules);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a firewall rule by ID
const updateFirewallRule = async (req, res) => {
    const { id } = req.params;
    const { endpoint_id, type, domain, ip_address, protocol } = req.body;

    try {
        // Find the firewall rule to update
        const firewallRule = await FirewallRule.findByPk(id);
        if (!firewallRule) {
            return res.status(404).json({ message: 'Firewall rule not found' });
        }

        // Update the firewall rule
        firewallRule.endpoint_id = endpoint_id || firewallRule.endpoint_id;
        firewallRule.type = type || firewallRule.type;
        firewallRule.domain = domain || firewallRule.domain;
        firewallRule.ip_address = ip_address || firewallRule.ip_address;
        firewallRule.protocol = protocol || firewallRule.protocol;

        await firewallRule.save();

        // Respond with the updated firewall rule
        res.status(200).json(firewallRule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a firewall rule by ID
const deleteFirewallRule = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the firewall rule to delete
        const firewallRule = await FirewallRule.findByPk(id);
        if (!firewallRule) {
            return res.status(404).json({ message: 'Firewall rule not found' });
        }

        // Delete the firewall rule
        await firewallRule.destroy();

        // Respond with a success message
        res.status(200).json({ message: 'Firewall rule deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createFirewallRule,
    updateFirewallRule,
    deleteFirewallRule,
    getFirewallRules,
};
