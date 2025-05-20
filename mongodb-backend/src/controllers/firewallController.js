const { FirewallRule, Application } = require('../models');
const logger = require('../utils/logger');

/**
 * Get all firewall rules
 * @route GET /api/firewall/rules
 * @access Private
 */
exports.getAllRules = async (req, res) => {
  try {
    const rules = await FirewallRule.find()
      .populate('applicationId', 'name');

    res.status(200).json({
      success: true,
      count: rules.length,
      data: rules
    });
  } catch (error) {
    logger.error(`Error getting firewall rules: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error retrieving firewall rules',
      error: error.message
    });
  }
};

/**
 * Get firewall rules by application ID
 * @route GET /api/firewall/rules/application/:applicationId
 * @access Private
 */
exports.getRulesByApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    // Check if application exists
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const rules = await FirewallRule.find({ applicationId })
      .sort({ priority: 1 });

    res.status(200).json({
      success: true,
      count: rules.length,
      data: rules
    });
  } catch (error) {
    logger.error(`Error getting firewall rules by application: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error retrieving firewall rules',
      error: error.message
    });
  }
};

/**
 * Get single firewall rule by ID
 * @route GET /api/firewall/rules/:id
 * @access Private
 */
exports.getRuleById = async (req, res) => {
  try {
    const rule = await FirewallRule.findById(req.params.id)
      .populate('applicationId', 'name');

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: 'Firewall rule not found'
      });
    }

    res.status(200).json({
      success: true,
      data: rule
    });
  } catch (error) {
    logger.error(`Error getting firewall rule: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error retrieving firewall rule',
      error: error.message
    });
  }
};

/**
 * Create new firewall rule
 * @route POST /api/firewall/rules
 * @access Private
 */
exports.createRule = async (req, res) => {
  try {
    const {
      applicationId,
      name,
      description,
      sourceIp,
      destinationIp,
      sourcePort,
      destinationPort,
      protocol,
      action,
      priority,
      enabled
    } = req.body;

    // Check if application exists
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Create new rule
    const rule = new FirewallRule({
      applicationId,
      name,
      description,
      sourceIp,
      destinationIp,
      sourcePort,
      destinationPort,
      protocol: protocol || 'ANY',
      action,
      priority: priority || 0,
      enabled: enabled !== undefined ? enabled : true
    });

    await rule.save();

    logger.info(`New firewall rule created: ${name} for application ${application.name}`);

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

/**
 * Update firewall rule
 * @route PUT /api/firewall/rules/:id
 * @access Private
 */
exports.updateRule = async (req, res) => {
  try {
    const {
      name,
      description,
      sourceIp,
      destinationIp,
      sourcePort,
      destinationPort,
      protocol,
      action,
      priority,
      enabled
    } = req.body;

    // Find rule by ID
    let rule = await FirewallRule.findById(req.params.id);

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: 'Firewall rule not found'
      });
    }

    // Update rule
    if (name) rule.name = name;
    if (description !== undefined) rule.description = description;
    if (sourceIp !== undefined) rule.sourceIp = sourceIp;
    if (destinationIp !== undefined) rule.destinationIp = destinationIp;
    if (sourcePort !== undefined) rule.sourcePort = sourcePort;
    if (destinationPort !== undefined) rule.destinationPort = destinationPort;
    if (protocol) rule.protocol = protocol;
    if (action) rule.action = action;
    if (priority !== undefined) rule.priority = priority;
    if (enabled !== undefined) rule.enabled = enabled;

    await rule.save();

    logger.info(`Firewall rule updated: ${rule.name}`);

    res.status(200).json({
      success: true,
      message: 'Firewall rule updated successfully',
      data: rule
    });
  } catch (error) {
    logger.error(`Error updating firewall rule: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating firewall rule',
      error: error.message
    });
  }
};

/**
 * Delete firewall rule
 * @route DELETE /api/firewall/rules/:id
 * @access Private
 */
exports.deleteRule = async (req, res) => {
  try {
    const rule = await FirewallRule.findById(req.params.id);

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: 'Firewall rule not found'
      });
    }

    const applicationId = rule.applicationId;

    await rule.deleteOne();

    // Notify via WebSocket if available
    if (global.wsServer) {
      const ruleData = {
        type: 'firewallRule',
        action: 'deleted',
        data: { id: req.params.id, applicationId }
      };

      // Broadcast to application subscribers
      global.wsServer.broadcastToApplicationSubscribers(applicationId, ruleData);
    }

    logger.info(`Firewall rule deleted: ${rule.name}`);

    res.status(200).json({
      success: true,
      message: 'Firewall rule deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting firewall rule: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting firewall rule',
      error: error.message
    });
  }
};

/**
 * Batch create firewall rules
 * @route POST /api/firewall/rules/batch
 * @access Private
 */
exports.batchCreateRules = async (req, res) => {
  try {
    const { applicationId, rules } = req.body;

    if (!applicationId || !rules || !Array.isArray(rules) || rules.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Application ID and rules array are required'
      });
    }

    // Check if application exists
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Prepare rules for insertion
    const rulesToInsert = rules.map(rule => ({
      applicationId,
      name: rule.name,
      description: rule.description,
      sourceIp: rule.sourceIp,
      destinationIp: rule.destinationIp,
      sourcePort: rule.sourcePort,
      destinationPort: rule.destinationPort,
      protocol: rule.protocol || 'ANY',
      action: rule.action,
      priority: rule.priority || 0,
      enabled: rule.enabled !== undefined ? rule.enabled : true
    }));

    // Insert rules in batch
    const createdRules = await FirewallRule.insertMany(rulesToInsert);

    // Notify via WebSocket if available
    if (global.wsServer) {
      const ruleData = {
        type: 'firewallRule',
        action: 'batchCreated',
        data: {
          applicationId,
          count: createdRules.length,
          rules: createdRules
        }
      };

      // Broadcast to application subscribers
      global.wsServer.broadcastToApplicationSubscribers(applicationId, ruleData);
    }

    logger.info(`Batch created ${createdRules.length} firewall rules for application ${application.name}`);

    res.status(201).json({
      success: true,
      message: `${createdRules.length} firewall rules created successfully`,
      data: createdRules
    });
  } catch (error) {
    logger.error(`Error batch creating firewall rules: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error batch creating firewall rules',
      error: error.message
    });
  }
};

/**
 * Batch update firewall rules
 * @route PUT /api/firewall/rules/batch
 * @access Private
 */
exports.batchUpdateRules = async (req, res) => {
  try {
    const { rules } = req.body;

    if (!rules || !Array.isArray(rules) || rules.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Rules array is required'
      });
    }

    const updatedRules = [];
    const errors = [];

    // Update each rule
    for (const ruleData of rules) {
      if (!ruleData.id) {
        errors.push({ message: 'Rule ID is required', data: ruleData });
        continue;
      }

      try {
        const rule = await FirewallRule.findById(ruleData.id);

        if (!rule) {
          errors.push({ message: 'Firewall rule not found', id: ruleData.id });
          continue;
        }

        // Update rule fields
        if (ruleData.name) rule.name = ruleData.name;
        if (ruleData.description !== undefined) rule.description = ruleData.description;
        if (ruleData.sourceIp !== undefined) rule.sourceIp = ruleData.sourceIp;
        if (ruleData.destinationIp !== undefined) rule.destinationIp = ruleData.destinationIp;
        if (ruleData.sourcePort !== undefined) rule.sourcePort = ruleData.sourcePort;
        if (ruleData.destinationPort !== undefined) rule.destinationPort = ruleData.destinationPort;
        if (ruleData.protocol) rule.protocol = ruleData.protocol;
        if (ruleData.action) rule.action = ruleData.action;
        if (ruleData.priority !== undefined) rule.priority = ruleData.priority;
        if (ruleData.enabled !== undefined) rule.enabled = ruleData.enabled;

        await rule.save();
        updatedRules.push(rule);

        // Notify via WebSocket if available
        if (global.wsServer) {
          const ruleUpdateData = {
            type: 'firewallRule',
            action: 'updated',
            data: rule
          };

          // Broadcast to application subscribers
          global.wsServer.broadcastToApplicationSubscribers(rule.applicationId, ruleUpdateData);
        }
      } catch (error) {
        errors.push({ message: error.message, id: ruleData.id });
      }
    }

    logger.info(`Batch updated ${updatedRules.length} firewall rules`);

    res.status(200).json({
      success: true,
      message: `${updatedRules.length} firewall rules updated successfully`,
      data: {
        updatedRules,
        errors: errors.length > 0 ? errors : undefined
      }
    });
  } catch (error) {
    logger.error(`Error batch updating firewall rules: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error batch updating firewall rules',
      error: error.message
    });
  }
};

/**
 * Batch delete firewall rules
 * @route DELETE /api/firewall/rules/batch
 * @access Private
 */
exports.batchDeleteRules = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Rule IDs array is required'
      });
    }

    // Get rules before deletion for notification
    const rulesToDelete = await FirewallRule.find({ _id: { $in: ids } });

    // Group rules by application for efficient notification
    const rulesByApplication = rulesToDelete.reduce((acc, rule) => {
      const appId = rule.applicationId.toString();
      if (!acc[appId]) {
        acc[appId] = [];
      }
      acc[appId].push(rule._id);
      return acc;
    }, {});

    // Delete rules
    const result = await FirewallRule.deleteMany({ _id: { $in: ids } });

    // Notify via WebSocket if available
    if (global.wsServer) {
      // Notify each application's subscribers
      for (const [appId, ruleIds] of Object.entries(rulesByApplication)) {
        const ruleData = {
          type: 'firewallRule',
          action: 'batchDeleted',
          data: {
            applicationId: appId,
            ids: ruleIds
          }
        };

        // Broadcast to application subscribers
        global.wsServer.broadcastToApplicationSubscribers(appId, ruleData);
      }
    }

    logger.info(`Batch deleted ${result.deletedCount} firewall rules`);

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} firewall rules deleted successfully`,
      data: {
        deletedCount: result.deletedCount
      }
    });
  } catch (error) {
    logger.error(`Error batch deleting firewall rules: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error batch deleting firewall rules',
      error: error.message
    });
  }
};