const { Endpoint, FirewallRule } = require('../models');
const logger = require('../utils/logger');

/**
 * Get firewall rules for specific endpoint
 * @route GET /api/firewall/rules
 * @access Public (No JWT required, only endpoint ID needed)
 */
exports.getEndpointRules = async (req, res) => {
  try {
    const endpointId = req.headers['x-endpoint-id'];

    if (!endpointId) {
      return res.status(401).json({
        success: false,
        message: 'X-Endpoint-ID header is required'
      });
    }

    // Verify endpoint exists (no password check needed for rule fetching)
    const endpoint = await Endpoint.findById(endpointId);
    if (!endpoint) {
      return res.status(404).json({
        success: false,
        message: 'Endpoint not found'
      });
    }

    // Get all enabled rules for this endpoint
    const rules = await FirewallRule.find({
      endpointId: endpointId,
      enabled: true
    }).sort({ priority: -1 });

    // Group rules by process name as expected by the flow
    const groupedRules = {};

    rules.forEach(rule => {
      if (!groupedRules[rule.processName]) {
        groupedRules[rule.processName] = [];
      }

      const ruleData = {
        entity_type: rule.entity_type,
        action: rule.action
      };

      // Add IP-specific fields
      if (rule.entity_type === 'ip') {
        if (rule.source_ip) ruleData.source_ip = rule.source_ip;
        if (rule.destination_ip) ruleData.destination_ip = rule.destination_ip;
        if (rule.source_port) ruleData.source_port = rule.source_port;
        if (rule.destination_port) ruleData.destination_port = rule.destination_port;
      }

      // Add domain-specific fields
      if (rule.entity_type === 'domain') {
        if (rule.domain_name) ruleData.domain_name = rule.domain_name;
      }

      groupedRules[rule.processName].push(ruleData);
    });

    // Update endpoint's last heartbeat
    endpoint.lastHeartbeat = new Date();
    await endpoint.save();

    logger.info(`Firewall rules fetched for endpoint ${endpoint.hostname}: ${rules.length} rules`);

    res.status(200).json(groupedRules);
  } catch (error) {
    logger.error(`Error fetching firewall rules: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error retrieving firewall rules',
      error: error.message
    });
  }
};

/**
 * Create firewall rule for endpoint (Admin function)
 * @route POST /api/firewall/rules
 * @access Private (JWT required)
 */
exports.createEndpointRule = async (req, res) => {
  try {
    const {
      endpointId,
      processName,
      entity_type,
      source_ip,
      destination_ip,
      source_port,
      destination_port,
      domain_name,
      action,
      priority,
      description
    } = req.body;

    // Validate required fields
    if (!endpointId || !processName || !entity_type || !action) {
      return res.status(400).json({
        success: false,
        message: 'Endpoint ID, process name, entity type, and action are required'
      });
    }

    // Verify endpoint exists
    const endpoint = await Endpoint.findById(endpointId);
    if (!endpoint) {
      return res.status(404).json({
        success: false,
        message: 'Endpoint not found'
      });
    }

    // Create new rule
    const rule = new FirewallRule({
      endpointId,
      processName,
      entity_type,
      source_ip,
      destination_ip,
      source_port,
      destination_port,
      domain_name,
      action,
      priority: priority || 0,
      description
    });

    await rule.save();

    logger.info(`New NGFW firewall rule created for ${endpoint.hostname}:${processName} - ${action}`);

    res.status(201).json({
      success: true,
      message: 'Firewall rule created successfully',
      data: rule
    });
  } catch (error) {
    logger.error(`Error creating firewall rule: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error creating firewall rule',
      error: error.message
    });
  }
};

module.exports = exports;
