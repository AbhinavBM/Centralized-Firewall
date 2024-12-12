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

// Create a New Log Entry
exports.createLog = async (req, res) => {
  try {
    const { source_ip, destination_ip, source_port, destination_port, protocol, source_service, destination_service, domain } = req.body;

    if (!source_ip || !destination_ip || !source_port || !destination_port || !protocol) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newLog = await Log.create({
      source_ip,
      destination_ip,
      source_port,
      destination_port,
      protocol,
      source_service,
      destination_service,
      domain,
    });

    res.status(201).json(newLog);
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
