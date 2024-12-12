const { Op } = require('sequelize');
const Log = require('../models/Log'); // Adjust the path to your Sequelize model

// Get All Logs with Pagination and Filtering
exports.getLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, source_ip, destination_ip, protocol, source_service, destination_service, domain, startDate, endDate } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (source_ip) where.source_ip = { [Op.like]: `%${source_ip}%` };
    if (destination_ip) where.destination_ip = { [Op.like]: `%${destination_ip}%` };
    if (protocol) where.protocol = { [Op.like]: `%${protocol}%` };
    if (source_service) where.source_service = { [Op.like]: `%${source_service}%` };
    if (destination_service) where.destination_service = { [Op.like]: `%${destination_service}%` };
    if (domain) where.domain = { [Op.like]: `%${domain}%` };
    if (startDate && endDate) {
      where.logged_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const logs = await Log.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit, 10),
      order: [['logged_at', 'DESC']],
    });

    res.status(200).json({
      logs: logs.rows,
      total: logs.count,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(logs.count / limit),
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Search Logs
exports.searchLogs = async (req, res) => {
  try {
    const { query } = req.query;

    const logs = await Log.findAll({
      where: {
        [Op.or]: [
          { source_ip: { [Op.like]: `%${query}%` } },
          { destination_ip: { [Op.like]: `%${query}%` } },
          { protocol: { [Op.like]: `%${query}%` } },
          { source_service: { [Op.like]: `%${query}%` } },
          { destination_service: { [Op.like]: `%${query}%` } },
          { domain: { [Op.like]: `%${query}%` } },
        ],
      },
    });

    res.status(200).json(logs);
  } catch (error) {
    console.error('Error searching logs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get Logs by Date Range
exports.getLogsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const logs = await Log.findAll({
      where: {
        logged_at: {
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

// Get Logs by Protocol
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




exports.createLog = async (req, res) => {
  try {
    const { logs } = req.body;

    if (!logs || !Array.isArray(logs) || logs.length === 0) {
      return res.status(400).json({ error: 'Invalid or missing logs array' });
    }

    // Validate each log entry
    const invalidLogs = logs.filter(log => {
      return (
        !log.source_ip ||
        !log.destination_ip ||
        !log.source_port ||
        !log.destination_port ||
        !log.protocol
      );
    });

    if (invalidLogs.length > 0) {
      return res.status(400).json({
        error: 'Some logs have missing required fields',
        invalidLogs,
      });
    }

    // Format logs to ensure consistency with the database schema
    const formattedLogs = logs.map(log => ({
      source_ip: log.source_ip,
      destination_ip: log.destination_ip,
      source_port: log.source_port,
      destination_port: log.destination_port,
      protocol: log.protocol,
      source_service: log.source_service || null,
      destination_service: log.destination_service || null,
      domain: log.domain || null,
      logged_at: log.logged_at || new Date(),
    }));

    // Insert logs into the database
    const newLogs = await Log.bulkCreate(formattedLogs);

    res.status(201).json({
      message: 'Logs created successfully',
      data: newLogs,
    });
  } catch (error) {
    console.error('Error creating logs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
