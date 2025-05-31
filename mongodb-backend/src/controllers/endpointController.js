const { Endpoint, EndpointApplicationMapping } = require('../models');
const logger = require('../utils/logger');

/**
 * Get all endpoints
 * @route GET /api/endpoints
 * @access Private
 */
exports.getAllEndpoints = async (req, res) => {
  try {
    const endpoints = await Endpoint.find();

    res.status(200).json({
      success: true,
      count: endpoints.length,
      data: endpoints
    });
  } catch (error) {
    logger.error(`Error getting endpoints: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error retrieving endpoints',
      error: error.message
    });
  }
};

/**
 * Get single endpoint by ID
 * @route GET /api/endpoints/:id
 * @access Private
 */
exports.getEndpointById = async (req, res) => {
  try {
    const endpoint = await Endpoint.findById(req.params.id);

    if (!endpoint) {
      return res.status(404).json({
        success: false,
        message: 'Endpoint not found'
      });
    }

    res.status(200).json({
      success: true,
      data: endpoint
    });
  } catch (error) {
    logger.error(`Error getting endpoint: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error retrieving endpoint',
      error: error.message
    });
  }
};

/**
 * Create new endpoint
 * @route POST /api/endpoints
 * @access Private
 */
exports.createEndpoint = async (req, res) => {
  try {
    const { hostname, os, ipAddress, status, password } = req.body;

    // Check if endpoint with same hostname or IP already exists
    const existingEndpoint = await Endpoint.findOne({
      $or: [{ hostname }, { ipAddress }]
    });

    if (existingEndpoint) {
      return res.status(400).json({
        success: false,
        message: 'Endpoint with this hostname or IP address already exists'
      });
    }

    // Create new endpoint
    const endpoint = new Endpoint({
      hostname,
      os,
      ipAddress,
      status: status || 'pending',
      password
    });

    await endpoint.save();

    logger.info(`New endpoint created: ${hostname} (${ipAddress})`);

    res.status(201).json({
      success: true,
      message: 'Endpoint created successfully',
      data: endpoint
    });
  } catch (error) {
    logger.error(`Error creating endpoint: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error creating endpoint',
      error: error.message
    });
  }
};

/**
 * Update endpoint
 * @route PUT /api/endpoints/:id
 * @access Private
 */
exports.updateEndpoint = async (req, res) => {
  try {
    const { hostname, os, ipAddress, status, password } = req.body;

    // Find endpoint by ID
    let endpoint = await Endpoint.findById(req.params.id);

    if (!endpoint) {
      return res.status(404).json({
        success: false,
        message: 'Endpoint not found'
      });
    }

    // Check if updating to an existing hostname or IP (that's not this endpoint's)
    if (hostname || ipAddress) {
      const existingEndpoint = await Endpoint.findOne({
        _id: { $ne: req.params.id },
        $or: [
          { hostname: hostname || '' },
          { ipAddress: ipAddress || '' }
        ]
      });

      if (existingEndpoint) {
        return res.status(400).json({
          success: false,
          message: 'Another endpoint with this hostname or IP address already exists'
        });
      }
    }

    // Update endpoint
    endpoint.hostname = hostname || endpoint.hostname;
    endpoint.os = os || endpoint.os;
    endpoint.ipAddress = ipAddress || endpoint.ipAddress;
    endpoint.status = status || endpoint.status;

    // Only update password if provided
    if (password) {
      endpoint.password = password;
    }

    await endpoint.save();

    logger.info(`Endpoint updated: ${endpoint.hostname} (${endpoint.ipAddress})`);

    res.status(200).json({
      success: true,
      message: 'Endpoint updated successfully',
      data: endpoint
    });
  } catch (error) {
    logger.error(`Error updating endpoint: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating endpoint',
      error: error.message
    });
  }
};

/**
 * Delete endpoint
 * @route DELETE /api/endpoints/:id
 * @access Private
 */
exports.deleteEndpoint = async (req, res) => {
  try {
    const endpoint = await Endpoint.findById(req.params.id);

    if (!endpoint) {
      return res.status(404).json({
        success: false,
        message: 'Endpoint not found'
      });
    }

    // Delete all mappings associated with this endpoint
    await EndpointApplicationMapping.deleteMany({ endpointId: req.params.id });

    // Delete all applications associated with this endpoint
    const { Application, FirewallRule } = require('../models');
    await Application.deleteMany({ endpointId: req.params.id });

    // Delete all firewall rules associated with this endpoint
    await FirewallRule.deleteMany({ endpointId: req.params.id });

    // Delete the endpoint
    await endpoint.deleteOne();

    logger.info(`Endpoint deleted: ${endpoint.hostname} (${endpoint.ipAddress})`);

    res.status(200).json({
      success: true,
      message: 'Endpoint deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting endpoint: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting endpoint',
      error: error.message
    });
  }
};

/**
 * Update endpoint status
 * @route PATCH /api/endpoints/:id/status
 * @access Private
 */
exports.updateEndpointStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const endpoint = await Endpoint.findById(req.params.id);

    if (!endpoint) {
      return res.status(404).json({
        success: false,
        message: 'Endpoint not found'
      });
    }

    endpoint.status = status;
    endpoint.lastHeartbeat = status === 'online' ? Date.now() : endpoint.lastHeartbeat;

    await endpoint.save();

    logger.info(`Endpoint status updated: ${endpoint.hostname} (${status})`);

    res.status(200).json({
      success: true,
      message: 'Endpoint status updated successfully',
      data: endpoint
    });
  } catch (error) {
    logger.error(`Error updating endpoint status: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating endpoint status',
      error: error.message
    });
  }
};

/**
 * Get endpoint statistics
 * @route GET /api/endpoints/stats
 * @access Private
 */
exports.getEndpointStats = async (req, res) => {
  try {
    const totalEndpoints = await Endpoint.countDocuments();

    // Count by status
    const statusStats = await Endpoint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Count by OS
    const osStats = await Endpoint.aggregate([
      { $group: { _id: '$os', count: { $sum: 1 } } }
    ]);

    // Get endpoints with application counts
    const endpointsWithApps = await Endpoint.aggregate([
      {
        $lookup: {
          from: 'applications',
          localField: '_id',
          foreignField: 'endpointId',
          as: 'applications'
        }
      },
      {
        $project: {
          hostname: 1,
          status: 1,
          lastHeartbeat: 1,
          applicationCount: { $size: '$applications' }
        }
      },
      { $sort: { applicationCount: -1 } },
      { $limit: 10 }
    ]);

    // Recent endpoints (last 10)
    const recentEndpoints = await Endpoint.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('hostname ipAddress status os createdAt lastHeartbeat');

    res.status(200).json({
      success: true,
      data: {
        total: totalEndpoints,
        byStatus: statusStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byOS: osStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        topEndpoints: endpointsWithApps,
        recent: recentEndpoints
      }
    });
  } catch (error) {
    logger.error(`Error getting endpoint statistics: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error retrieving endpoint statistics',
      error: error.message
    });
  }
};
