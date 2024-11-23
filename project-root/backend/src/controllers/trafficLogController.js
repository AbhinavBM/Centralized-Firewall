const TrafficLog = require('../models/TrafficLog');
const { Op } = require('sequelize');

// Get all traffic logs
const getTrafficLogs = async (req, res) => {
    try {
        // Fetch all traffic logs from the TrafficLog model
        const trafficLogs = await TrafficLog.findAll();

        // Respond with the traffic logs
        res.status(200).json(trafficLogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Analyze traffic logs (e.g., detect anomalies)
const analyzeTraffic = async (req, res) => {
    try {
        // Get the parameters from the request body (e.g., date range, protocol, etc.)
        const { startDate, endDate, protocol, threshold } = req.body;

        // Build the query to filter traffic logs based on input criteria
        const whereClause = {};
        if (startDate && endDate) {
            whereClause.timestamp = { [Op.between]: [new Date(startDate), new Date(endDate)] };
        }
        if (protocol) {
            whereClause.protocol = protocol;
        }

        // Fetch the traffic logs based on the filters
        const trafficLogs = await TrafficLog.findAll({
            where: whereClause,
        });

        // Example traffic analysis: Detect anomalies based on threshold for data_transferred
        let anomalies = [];
        trafficLogs.forEach(log => {
            if (log.data_transferred > threshold) {
                anomalies.push(log);
            }
        });

        // Respond with the analysis results
        res.status(200).json({
            totalLogs: trafficLogs.length,
            anomaliesDetected: anomalies.length,
            anomalies: anomalies,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getTrafficLogs,
    analyzeTraffic,
};
