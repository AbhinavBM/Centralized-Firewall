const { Log } = require('../models');
const logger = require('../utils/logger');

/**
 * Validate log data according to the schema
 */
const validateLogData = (logData) => {
  const validTypes = ['system', 'user', 'firewall', 'endpoint', 'application'];
  const validLevels = ['info', 'warning', 'error', 'critical'];

  const errors = [];

  if (!logData.type || !validTypes.includes(logData.type)) {
    errors.push('Invalid or missing type');
  }

  if (!logData.level || !validLevels.includes(logData.level)) {
    errors.push('Invalid or missing level');
  }

  if (!logData.message || typeof logData.message !== 'string') {
    errors.push('Invalid or missing message');
  }

  if (logData.timestamp && isNaN(new Date(logData.timestamp).getTime())) {
    errors.push('Invalid timestamp format');
  }

  return {
    is_valid: errors.length === 0,
    errors: errors
  };
};

/**
 * Create single log entry
 * @route POST /api/logs
 * @access Public (No JWT required)
 */
exports.createLog = async (req, res) => {
  try {
    const logData = req.body;

    // Validate log data
    const validation = validateLogData(logData);

    if (!validation.is_valid) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid log data',
        validation_results: [{
          is_valid: false,
          log_data: logData,
          validation_details: validation.errors.reduce((acc, error) => {
            acc[error.split(' ')[2] || 'general'] = error;
            return acc;
          }, {})
        }]
      });
    }

    // Create log entry
    const log = new Log({
      type: logData.type,
      level: logData.level,
      message: logData.message,
      details: logData.details || {},
      userId: logData.userId || null,
      endpointId: logData.endpointId || null,
      applicationId: logData.applicationId || null,
      timestamp: logData.timestamp ? new Date(logData.timestamp) : new Date()
    });

    await log.save();

    logger.info(`NGFW log received: ${logData.type}/${logData.level} - ${logData.message}`);

    res.status(200).json({
      status: 'success',
      message: 'Log received',
      validation_results: [{
        is_valid: true,
        log_data: logData,
        validation_details: {
          type: 'valid',
          level: 'valid',
          message: 'valid',
          details: 'valid',
          timestamp: 'valid'
        }
      }]
    });
  } catch (error) {
    logger.error(`Error creating log: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Error processing log',
      error: error.message
    });
  }
};

/**
 * Create multiple log entries (batch)
 * @route POST /api/logs/batch
 * @access Public (No JWT required)
 */
exports.createBatchLogs = async (req, res) => {
  try {
    const { logs } = req.body;

    if (!logs || !Array.isArray(logs)) {
      return res.status(400).json({
        status: 'error',
        message: 'Logs array is required'
      });
    }

    const validationResults = [];
    const validLogs = [];

    // Validate each log
    for (const logData of logs) {
      const validation = validateLogData(logData);

      if (validation.is_valid) {
        validLogs.push({
          type: logData.type,
          level: logData.level,
          message: logData.message,
          details: logData.details || {},
          userId: logData.userId || null,
          endpointId: logData.endpointId || null,
          applicationId: logData.applicationId || null,
          timestamp: logData.timestamp ? new Date(logData.timestamp) : new Date()
        });

        validationResults.push({
          is_valid: true,
          log_data: logData
        });
      } else {
        validationResults.push({
          is_valid: false,
          log_data: logData,
          validation_errors: validation.errors
        });
      }
    }

    // Insert valid logs
    if (validLogs.length > 0) {
      await Log.insertMany(validLogs);
    }

    logger.info(`NGFW batch logs processed: ${validLogs.length}/${logs.length} valid logs saved`);

    res.status(200).json({
      status: 'success',
      message: `Processed ${logs.length} logs, ${validLogs.length} valid`,
      total_logs: logs.length,
      valid_logs: validLogs.length,
      invalid_logs: logs.length - validLogs.length,
      validation_results: validationResults
    });
  } catch (error) {
    logger.error(`Error creating batch logs: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Error processing batch logs',
      error: error.message
    });
  }
};

/**
 * Get log statistics
 * @route GET /api/logs/stats
 * @access Public (No JWT required)
 */
exports.getLogStats = async (req, res) => {
  try {
    // Get total count
    const totalLogs = await Log.countDocuments();

    // Get counts by type
    const byType = await Log.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get counts by level
    const byLevel = await Log.aggregate([
      { $group: { _id: '$level', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get counts by message
    const byMessage = await Log.aggregate([
      { $group: { _id: '$message', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get recent logs (last 10)
    const recentLogs = await Log.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .select('type level message details timestamp');

    // Format the response
    const stats = {
      total_logs: totalLogs,
      by_type: byType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      by_level: byLevel.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      by_message: byMessage.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recent_logs: recentLogs.map(log => ({
        log_data: {
          type: log.type,
          level: log.level,
          message: log.message,
          details: log.details,
          timestamp: log.timestamp.toISOString()
        },
        received_at: log.createdAt.toISOString(),
        is_valid: true
      }))
    };

    logger.info(`NGFW log statistics requested: ${totalLogs} total logs`);

    res.status(200).json({
      status: 'success',
      stats: stats
    });
  } catch (error) {
    logger.error(`Error getting log statistics: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving log statistics',
      error: error.message
    });
  }
};

module.exports = exports;
