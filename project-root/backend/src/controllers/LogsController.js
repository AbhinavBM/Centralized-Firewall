const { Op } = require('sequelize');
const Log = require('../models/Log')

// Get all logs with pagination, filtering, and optional date range
exports.getLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, endpointId, application, action, protocol, startDate, endDate } = req.query;

    const where = {};
    if (endpointId) where.endpoint_id = endpointId;
    if (action) where.action = action;
    if (protocol) where.protocol = protocol;
    if (startDate && endDate) {
      where.timestamp = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const offset = (page - 1) * limit;

    const logs = await Log.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit, 10),
    });

    res.status(200).json({
      logs: logs.rows,
      total: logs.count,
      currentPage: page,
      totalPages: Math.ceil(logs.count / limit),
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Search logs based on a query
exports.searchLogs = async (req, res) => {
  try {
    const { query } = req.query;

    const logs = await Log.findAll({
      where: {
        [Op.or]: [
          { source_ip: { [Op.like]: `%${query}%` } },
          { destination_ip: { [Op.like]: `%${query}%` } },
          { protocol: { [Op.like]: `%${query}%` } },
          { action: { [Op.like]: `%${query}%` } },
        ],
      },
    });

    res.status(200).json(logs);
  } catch (error) {
    console.error('Error searching logs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get logs by date range
exports.getLogsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const logs = await Log.findAll({
      where: {
        timestamp: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });

    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching logs by date range:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get logs by application
exports.getLogsByApplication = async (req, res) => {
  try {
    const { application } = req.query;

    const logs = await Log.findAll({
      where: { application },
    });

    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching logs by application:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get logs by protocol
exports.getLogsByProtocol = async (req, res) => {
  try {
    const { protocol } = req.query;

    const logs = await Log.findAll({
      where: { protocol },
    });

    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching logs by protocol:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get logs by endpoint
exports.getLogsByEndpoint = async (req, res) => {
  try {
    const { endpointId } = req.params;

    const logs = await Log.findAll({
      where: { endpoint_id: endpointId },
    });

    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching logs by endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
