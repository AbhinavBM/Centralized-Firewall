const { FirewallRule, Application } = require('../models');
const logger = require('../utils/logger');

/**
 * Get all firewall rules
 * @route GET /api/firewall/rules
 * @access Private
 */
exports.getAllRules = async (req, res) => {
  try {
    const { endpointId, processName } = req.query;

    // Build query filter
    const filter = {};
    if (endpointId) {
      filter.endpointId = endpointId;
    }
    if (processName) {
      filter.processName = processName;
    }

    const rules = await FirewallRule.find(filter)
      .populate('applicationId', 'name processName')
      .populate('endpointId', 'hostname ipAddress');

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
      .populate('applicationId', 'name processName')
      .populate('endpointId', 'hostname ipAddress')
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
      endpointId,
      applicationId,
      processName,
      name,
      description,
      // NGFW fields
      entity_type,
      source_ip,
      destination_ip,
      source_port,
      destination_port,
      domain_name,
      // Legacy fields
      entityType,
      domain,
      sourceIp,
      destinationIp,
      sourcePort,
      destinationPort,
      protocol,
      action,
      priority,
      enabled
    } = req.body;

    // Check if application exists (only if applicationId is provided)
    let application = null;
    if (applicationId) {
      application = await Application.findById(applicationId);
      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }
    }

    // Create new rule with unified fields
    const rule = new FirewallRule({
      endpointId: endpointId || null,
      applicationId: applicationId || null,
      processName: processName || (application ? application.processName : null),
      name,
      description,
      // NGFW fields (prioritize these)
      entity_type: entity_type || entityType || 'ip',
      source_ip: source_ip || sourceIp,
      destination_ip: destination_ip || destinationIp,
      source_port: source_port || sourcePort,
      destination_port: destination_port || destinationPort,
      domain_name: domain_name || domain,
      action: action,
      // Legacy fields for backward compatibility
      entityType: entity_type || entityType || 'ip',
      domain: domain_name || domain,
      sourceIp: source_ip || sourceIp,
      destinationIp: destination_ip || destinationIp,
      sourcePort: source_port || sourcePort,
      destinationPort: destination_port || destinationPort,
      protocol: protocol || 'ANY',
      priority: priority || 0,
      enabled: enabled !== undefined ? enabled : true
    });

    await rule.save();

    logger.info(`New firewall rule created: ${name || 'Unnamed Rule'}${application ? ` for application ${application.name}` : ' (standalone rule)'}`);

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
      endpointId,
      processName,
      name,
      description,
      // NGFW fields
      entity_type,
      source_ip,
      destination_ip,
      source_port,
      destination_port,
      domain_name,
      // Legacy fields
      entityType,
      domain,
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

    // Update rule with unified fields
    if (endpointId !== undefined) rule.endpointId = endpointId;
    if (processName !== undefined) rule.processName = processName;
    if (name) rule.name = name;
    if (description !== undefined) rule.description = description;

    // Update NGFW fields (prioritize these)
    if (entity_type !== undefined) {
      rule.entity_type = entity_type;
      rule.entityType = entity_type; // Keep legacy field in sync
    } else if (entityType !== undefined) {
      rule.entityType = entityType;
      rule.entity_type = entityType; // Keep NGFW field in sync
    }

    if (source_ip !== undefined) {
      rule.source_ip = source_ip;
      rule.sourceIp = source_ip; // Keep legacy field in sync
    } else if (sourceIp !== undefined) {
      rule.sourceIp = sourceIp;
      rule.source_ip = sourceIp; // Keep NGFW field in sync
    }

    if (destination_ip !== undefined) {
      rule.destination_ip = destination_ip;
      rule.destinationIp = destination_ip; // Keep legacy field in sync
    } else if (destinationIp !== undefined) {
      rule.destinationIp = destinationIp;
      rule.destination_ip = destinationIp; // Keep NGFW field in sync
    }

    if (source_port !== undefined) {
      rule.source_port = source_port;
      rule.sourcePort = source_port; // Keep legacy field in sync
    } else if (sourcePort !== undefined) {
      rule.sourcePort = sourcePort;
      rule.source_port = sourcePort; // Keep NGFW field in sync
    }

    if (destination_port !== undefined) {
      rule.destination_port = destination_port;
      rule.destinationPort = destination_port; // Keep legacy field in sync
    } else if (destinationPort !== undefined) {
      rule.destinationPort = destinationPort;
      rule.destination_port = destinationPort; // Keep NGFW field in sync
    }

    if (domain_name !== undefined) {
      rule.domain_name = domain_name;
      rule.domain = domain_name; // Keep legacy field in sync
    } else if (domain !== undefined) {
      rule.domain = domain;
      rule.domain_name = domain; // Keep NGFW field in sync
    }

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
      entityType: rule.entityType || 'ip',
      domain: rule.domain,
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
        if (ruleData.entityType) rule.entityType = ruleData.entityType;
        if (ruleData.domain !== undefined) rule.domain = ruleData.domain;
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

/**
 * Get firewall rules by endpoint ID
 * @route GET /api/firewall/rules/endpoint/:endpointId
 * @access Private
 */
exports.getRulesByEndpoint = async (req, res) => {
  try {
    const { endpointId } = req.params;

    const rules = await FirewallRule.find({ endpointId })
      .populate('applicationId', 'name processName')
      .populate('endpointId', 'hostname ipAddress')
      .sort({ priority: 1 });

    res.status(200).json({
      success: true,
      count: rules.length,
      data: rules
    });
  } catch (error) {
    logger.error(`Error getting firewall rules by endpoint: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error retrieving firewall rules',
      error: error.message
    });
  }
};

/**
 * Get firewall rule statistics
 * @route GET /api/firewall/rules/stats
 * @access Private
 */
exports.getFirewallStats = async (req, res) => {
  try {
    const totalRules = await FirewallRule.countDocuments();

    // Count by action
    const actionStats = await FirewallRule.aggregate([
      { $group: { _id: '$action', count: { $sum: 1 } } }
    ]);

    // Count by entity type
    const entityTypeStats = await FirewallRule.aggregate([
      { $group: { _id: '$entity_type', count: { $sum: 1 } } }
    ]);

    // Count by endpoint
    const endpointStats = await FirewallRule.aggregate([
      { $match: { endpointId: { $ne: null } } },
      { $group: { _id: '$endpointId', count: { $sum: 1 } } },
      { $lookup: { from: 'endpoints', localField: '_id', foreignField: '_id', as: 'endpoint' } },
      { $unwind: '$endpoint' },
      { $project: { hostname: '$endpoint.hostname', count: 1 } }
    ]);

    // Recent rules (last 10)
    const recentRules = await FirewallRule.find()
      .populate('applicationId', 'name processName')
      .populate('endpointId', 'hostname')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name action entity_type enabled createdAt applicationId endpointId');

    res.status(200).json({
      success: true,
      data: {
        total: totalRules,
        byAction: actionStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byEntityType: entityTypeStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byEndpoint: endpointStats,
        recent: recentRules
      }
    });
  } catch (error) {
    logger.error(`Error getting firewall statistics: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error retrieving firewall statistics',
      error: error.message
    });
  }
};
