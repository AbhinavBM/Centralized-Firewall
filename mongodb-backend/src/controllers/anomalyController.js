const { Anomaly, Endpoint, Application } = require('../models');
const logger = require('../utils/logger');

/**
 * Get all anomalies with pagination
 * @route GET /api/anomalies
 * @access Private
 */
exports.getAllAnomalies = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    
    // Filter options
    const filter = {};
    
    if (req.query.severity) {
      filter.severity = req.query.severity;
    }
    
    if (req.query.resolved !== undefined) {
      filter.resolved = req.query.resolved === 'true';
    }
    
    if (req.query.startDate && req.query.endDate) {
      filter.timestamp = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    } else if (req.query.startDate) {
      filter.timestamp = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      filter.timestamp = { $lte: new Date(req.query.endDate) };
    }
    
    // Get total count
    const total = await Anomaly.countDocuments(filter);
    
    // Get anomalies with pagination
    const anomalies = await Anomaly.find(filter)
      .sort({ timestamp: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('endpointId', 'hostname ipAddress')
      .populate('applicationId', 'name')
      .populate('resolvedBy', 'username');
    
    // Pagination result
    const pagination = {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
    
    res.status(200).json({
      success: true,
      pagination,
      data: anomalies
    });
  } catch (error) {
    logger.error(`Error getting anomalies: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error retrieving anomalies',
      error: error.message
    });
  }
};

/**
 * Get anomaly by ID
 * @route GET /api/anomalies/:id
 * @access Private
 */
exports.getAnomalyById = async (req, res) => {
  try {
    const anomaly = await Anomaly.findById(req.params.id)
      .populate('endpointId', 'hostname ipAddress')
      .populate('applicationId', 'name')
      .populate('resolvedBy', 'username');
    
    if (!anomaly) {
      return res.status(404).json({
        success: false,
        message: 'Anomaly not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: anomaly
    });
  } catch (error) {
    logger.error(`Error getting anomaly: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error retrieving anomaly',
      error: error.message
    });
  }
};

/**
 * Get anomalies by endpoint ID
 * @route GET /api/anomalies/endpoint/:endpointId
 * @access Private
 */
exports.getAnomaliesByEndpoint = async (req, res) => {
  try {
    const { endpointId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    
    // Check if endpoint exists
    const endpoint = await Endpoint.findById(endpointId);
    if (!endpoint) {
      return res.status(404).json({
        success: false,
        message: 'Endpoint not found'
      });
    }
    
    // Filter options
    const filter = { endpointId };
    
    if (req.query.severity) {
      filter.severity = req.query.severity;
    }
    
    if (req.query.resolved !== undefined) {
      filter.resolved = req.query.resolved === 'true';
    }
    
    // Get total count
    const total = await Anomaly.countDocuments(filter);
    
    // Get anomalies with pagination
    const anomalies = await Anomaly.find(filter)
      .sort({ timestamp: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('applicationId', 'name')
      .populate('resolvedBy', 'username');
    
    // Pagination result
    const pagination = {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
    
    res.status(200).json({
      success: true,
      pagination,
      data: anomalies
    });
  } catch (error) {
    logger.error(`Error getting anomalies by endpoint: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error retrieving anomalies',
      error: error.message
    });
  }
};

/**
 * Get anomalies by application ID
 * @route GET /api/anomalies/application/:applicationId
 * @access Private
 */
exports.getAnomaliesByApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    
    // Check if application exists
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Filter options
    const filter = { applicationId };
    
    if (req.query.severity) {
      filter.severity = req.query.severity;
    }
    
    if (req.query.resolved !== undefined) {
      filter.resolved = req.query.resolved === 'true';
    }
    
    // Get total count
    const total = await Anomaly.countDocuments(filter);
    
    // Get anomalies with pagination
    const anomalies = await Anomaly.find(filter)
      .sort({ timestamp: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('endpointId', 'hostname ipAddress')
      .populate('resolvedBy', 'username');
    
    // Pagination result
    const pagination = {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
    
    res.status(200).json({
      success: true,
      pagination,
      data: anomalies
    });
  } catch (error) {
    logger.error(`Error getting anomalies by application: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error retrieving anomalies',
      error: error.message
    });
  }
};

/**
 * Create new anomaly
 * @route POST /api/anomalies
 * @access Private
 */
exports.createAnomaly = async (req, res) => {
  try {
    const {
      endpointId,
      applicationId,
      anomalyType,
      description,
      severity
    } = req.body;
    
    // Check if endpoint exists
    const endpoint = await Endpoint.findById(endpointId);
    if (!endpoint) {
      return res.status(404).json({
        success: false,
        message: 'Endpoint not found'
      });
    }
    
    // Check if application exists (if provided)
    if (applicationId) {
      const application = await Application.findById(applicationId);
      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }
    }
    
    // Create new anomaly
    const anomaly = new Anomaly({
      endpointId,
      applicationId,
      anomalyType,
      description,
      severity: severity || 'medium',
      resolved: false
    });
    
    await anomaly.save();
    
    // Notify via WebSocket if available
    if (global.wsServer) {
      const anomalyData = {
        type: 'anomaly',
        action: 'created',
        data: {
          id: anomaly._id,
          endpointId: anomaly.endpointId,
          applicationId: anomaly.applicationId,
          anomalyType: anomaly.anomalyType,
          severity: anomaly.severity,
          timestamp: anomaly.timestamp
        }
      };
      
      // Broadcast to admin users
      global.wsServer.broadcastToRole(anomalyData, 'admin');
    }
    
    res.status(201).json({
      success: true,
      message: 'Anomaly created successfully',
      data: anomaly
    });
  } catch (error) {
    logger.error(`Error creating anomaly: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error creating anomaly',
      error: error.message
    });
  }
};

/**
 * Update anomaly resolution status
 * @route PATCH /api/anomalies/:id/resolve
 * @access Private
 */
exports.resolveAnomaly = async (req, res) => {
  try {
    const anomaly = await Anomaly.findById(req.params.id);
    
    if (!anomaly) {
      return res.status(404).json({
        success: false,
        message: 'Anomaly not found'
      });
    }
    
    // Update resolution status
    anomaly.resolved = true;
    anomaly.resolvedBy = req.user.id;
    anomaly.resolvedAt = Date.now();
    
    await anomaly.save();
    
    // Notify via WebSocket if available
    if (global.wsServer) {
      const anomalyData = {
        type: 'anomaly',
        action: 'resolved',
        data: {
          id: anomaly._id,
          resolvedBy: req.user.id,
          resolvedAt: anomaly.resolvedAt
        }
      };
      
      // Broadcast to all users
      global.wsServer.broadcast(anomalyData);
    }
    
    res.status(200).json({
      success: true,
      message: 'Anomaly resolved successfully',
      data: anomaly
    });
  } catch (error) {
    logger.error(`Error resolving anomaly: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error resolving anomaly',
      error: error.message
    });
  }
};

/**
 * Delete anomaly
 * @route DELETE /api/anomalies/:id
 * @access Private (Admin only)
 */
exports.deleteAnomaly = async (req, res) => {
  try {
    const anomaly = await Anomaly.findById(req.params.id);
    
    if (!anomaly) {
      return res.status(404).json({
        success: false,
        message: 'Anomaly not found'
      });
    }
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete anomalies'
      });
    }
    
    await anomaly.remove();
    
    res.status(200).json({
      success: true,
      message: 'Anomaly deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting anomaly: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting anomaly',
      error: error.message
    });
  }
};
