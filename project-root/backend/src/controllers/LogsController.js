const Log = require('../models/Logs');
const { Op } = require('sequelize');

// Create a new log entry
exports.createLog = async (req, res) => {
    try {
        const log = await Log.create(req.body);
        res.status(201).json(log);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all logs with pagination and filtering
exports.getAllLogs = async (req, res) => {
    const { page = 1, limit = 10, action, protocol } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (action) where.action = action;
    if (protocol) where.protocol = protocol;

    try {
        const logs = await Log.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['timestamp', 'DESC']],
        });

        res.status(200).json({
            total: logs.count,
            page: parseInt(page),
            logs: logs.rows,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get logs by endpoint_id
exports.getLogsByEndpoint = async (req, res) => {
    try {
        const logs = await Log.findAll({ where: { endpoint_id: req.params.id } });
        res.status(200).json(logs);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a log by ID
exports.updateLogById = async (req, res) => {
    try {
        const log = await Log.findByPk(req.params.id);
        if (!log) return res.status(404).json({ message: 'Log not found' });

        const updatedLog = await log.update(req.body);
        res.status(200).json(updatedLog);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a log by ID
exports.deleteLogById = async (req, res) => {
    try {
        const rowsDeleted = await Log.destroy({ where: { id: req.params.id } });
        if (rowsDeleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Log not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get logs in a date range
exports.getLogsByDateRange = async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        const logs = await Log.findAll({
            where: {
                timestamp: {
                    [Op.between]: [new Date(startDate), new Date(endDate)],
                },
            },
        });

        res.status(200).json(logs);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
