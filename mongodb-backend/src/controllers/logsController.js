const { TrafficLog, Log, Endpoint, Application } = require('../models');
const logger = require('../utils/logger');

/**
 * Get all traffic logs with pagination
 * @route GET /api/logs/traffic
 * @access Private
 */
exports.getTrafficLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    
    // Filter options
    const filter = {};
    
    if (req.query.endpointId) {
      filter.endpointId = req.query.endpointId;
    }
    
    if (req.query.applicationId) {
      filter.applicationId = req.query.applicationId;
    }
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.trafficType) {
      filter.trafficType = req.query.trafficType;
    }
    
    if (req.query.protocol) {
      filter.protocol = req.query.protocol;
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
    const total = await TrafficLog.countDocuments(filter);
    
    // Get logs with pagination
    const logs = await TrafficLog.find(filter)
      .sort({ timestamp: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('endpointId', 'hostname ipAddress')
      .populate('applicationId', 'name');
    
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
      data: logs
    });
  } catch (error) {
    logger.error(`Error getting traffic logs: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error retrieving traffic logs',
      error: error.message
    });
  }
};

/**
 * Get traffic logs by endpoint ID
 * @route GET /api/logs/traffic/endpoint/:endpointId
 * @access Private
 */
exports.getTrafficLogsByEndpoint = async (req, res) => {
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
    
    // Get total count
    const total = await TrafficLog.countDocuments({ endpointId });
    
    // Get logs with pagination
    const logs = await TrafficLog.find({ endpointId })
      .sort({ timestamp: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('applicationId', 'name');
    
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
      data: logs
    });
  } catch (error) {
    logger.error(`Error getting traffic logs by endpoint: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error retrieving traffic logs',
      error: error.message
    });
  }
};

/**
 * Get traffic logs by application ID
 * @route GET /api/logs/traffic/application/:applicationId
 * @access Private
 */
exports.getTrafficLogsByApplication = async (req, res) => {
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
    
    // Get total count
    const total = await TrafficLog.countDocuments({ applicationId });
    
    // Get logs with pagination
    const logs = await TrafficLog.find({ applicationId })
      .sort({ timestamp: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('endpointId', 'hostname ipAddress');
    
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
      data: logs
    });
  } catch (error) {
    logger.error(`Error getting traffic logs by application: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error retrieving traffic logs',
      error: error.message
    });
  }
};

/**
 * Create new traffic log
 * @route POST /api/logs/traffic
 * @access Private
 */
exports.createTrafficLog = async (req, res) => {
  try {
    const {
      endpointId,
      applicationId,
      sourceIp,
      destinationIp,
      protocol,
      status,
      trafficType,
      dataTransferred,
      sourcePort,
      destinationPort,
      packetData
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
    
    // Create new traffic log
    const trafficLog = new TrafficLog({
      endpointId,
      applicationId,
      sourceIp,
      destinationIp,
      protocol,
      status,
      trafficType,
      dataTransferred: dataTransferred || 0,
      sourcePort,
      destinationPort,
      packetData
    });
    
    await trafficLog.save();
    
    res.status(201).json({
      success: true,
      message: 'Traffic log created successfully',
      data: trafficLog
    });
  } catch (error) {
    logger.error(`Error creating traffic log: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error creating traffic log',
      error: error.message
    });
  }
};

/**
 * Get system logs with pagination
 * @route GET /api/logs/system
 * @access Private
 */
exports.getSystemLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    
    // Filter options
    const filter = { type: 'system' };
    
    if (req.query.level) {
      filter.level = req.query.level;
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
    const total = await Log.countDocuments(filter);
    
    // Get logs with pagination
    const logs = await Log.find(filter)
      .sort({ timestamp: -1 })
      .skip(startIndex)
      .limit(limit);
    
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
      data: logs
    });
  } catch (error) {
    logger.error(`Error getting system logs: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error retrieving system logs',
      error: error.message
    });
  }
};

/**
 * Create new system log
 * @route POST /api/logs/system
 * @access Private
 */
exports.createSystemLog = async (req, res) => {
  try {
    const { level, message, details } = req.body;
    
    // Create new system log
    const log = new Log({
      type: 'system',
      level,
      message,
      details,
      userId: req.user ? req.user.id : null
    });
    
    await log.save();
    
    res.status(201).json({
      success: true,
      message: 'System log created successfully',
      data: log
    });
  } catch (error) {
    logger.error(`Error creating system log: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error creating system log',
      error: error.message
    });
  }
};
