const { TrafficLog, Anomaly, Endpoint, Application, FirewallRule } = require('../models');
const logger = require('../utils/logger');

/**
 * Get traffic statistics
 * @route GET /api/analytics/traffic
 * @access Private
 */
exports.getTrafficStats = async (req, res) => {
  try {
    // Time range filter
    const timeFilter = {};
    if (req.query.startDate && req.query.endDate) {
      timeFilter.timestamp = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    } else if (req.query.startDate) {
      timeFilter.timestamp = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      timeFilter.timestamp = { $lte: new Date(req.query.endDate) };
    } else {
      // Default to last 7 days if no date range provided
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      timeFilter.timestamp = { $gte: lastWeek };
    }

    // Total traffic count
    const totalTraffic = await TrafficLog.countDocuments(timeFilter);
    
    // Traffic by status (allowed vs blocked)
    const trafficByStatus = await TrafficLog.aggregate([
      { $match: timeFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Traffic by protocol
    const trafficByProtocol = await TrafficLog.aggregate([
      { $match: timeFilter },
      { $group: { _id: '$protocol', count: { $sum: 1 } } }
    ]);
    
    // Traffic by type (inbound vs outbound)
    const trafficByType = await TrafficLog.aggregate([
      { $match: timeFilter },
      { $group: { _id: '$trafficType', count: { $sum: 1 } } }
    ]);
    
    // Traffic volume over time (daily)
    const trafficOverTime = await TrafficLog.aggregate([
      { $match: timeFilter },
      {
        $group: {
          _id: { 
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } 
          },
          count: { $sum: 1 },
          dataTransferred: { $sum: '$dataTransferred' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Top 10 source IPs
    const topSourceIps = await TrafficLog.aggregate([
      { $match: timeFilter },
      { $group: { _id: '$sourceIp', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Top 10 destination IPs
    const topDestinationIps = await TrafficLog.aggregate([
      { $match: timeFilter },
      { $group: { _id: '$destinationIp', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalTraffic,
        trafficByStatus: trafficByStatus.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        trafficByProtocol: trafficByProtocol.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        trafficByType: trafficByType.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        trafficOverTime,
        topSourceIps,
        topDestinationIps
      }
    });
  } catch (error) {
    logger.error(`Error getting traffic statistics: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error retrieving traffic statistics',
      error: error.message
    });
  }
};

/**
 * Get anomaly statistics
 * @route GET /api/analytics/anomalies
 * @access Private
 */
exports.getAnomalyStats = async (req, res) => {
  try {
    // Time range filter
    const timeFilter = {};
    if (req.query.startDate && req.query.endDate) {
      timeFilter.timestamp = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    } else if (req.query.startDate) {
      timeFilter.timestamp = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      timeFilter.timestamp = { $lte: new Date(req.query.endDate) };
    } else {
      // Default to last 30 days if no date range provided
      const lastMonth = new Date();
      lastMonth.setDate(lastMonth.getDate() - 30);
      timeFilter.timestamp = { $gte: lastMonth };
    }
    
    // Total anomalies count
    const totalAnomalies = await Anomaly.countDocuments(timeFilter);
    
    // Anomalies by severity
    const anomaliesBySeverity = await Anomaly.aggregate([
      { $match: timeFilter },
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);
    
    // Anomalies by type
    const anomaliesByType = await Anomaly.aggregate([
      { $match: timeFilter },
      { $group: { _id: '$anomalyType', count: { $sum: 1 } } }
    ]);
    
    // Anomalies by resolution status
    const anomaliesByResolution = await Anomaly.aggregate([
      { $match: timeFilter },
      { $group: { _id: '$resolved', count: { $sum: 1 } } }
    ]);
    
    // Anomalies over time (daily)
    const anomaliesOverTime = await Anomaly.aggregate([
      { $match: timeFilter },
      {
        $group: {
          _id: { 
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Top 10 endpoints with most anomalies
    const topEndpointsWithAnomalies = await Anomaly.aggregate([
      { $match: timeFilter },
      { $group: { _id: '$endpointId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Populate endpoint details for top endpoints
    const populatedTopEndpoints = await Promise.all(
      topEndpointsWithAnomalies.map(async (item) => {
        const endpoint = await Endpoint.findById(item._id, 'hostname ipAddress');
        return {
          endpointId: item._id,
          hostname: endpoint ? endpoint.hostname : 'Unknown',
          ipAddress: endpoint ? endpoint.ipAddress : 'Unknown',
          count: item.count
        };
      })
    );
    
    res.status(200).json({
      success: true,
      data: {
        totalAnomalies,
        anomaliesBySeverity: anomaliesBySeverity.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        anomaliesByType: anomaliesByType.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        anomaliesByResolution: anomaliesByResolution.reduce((acc, curr) => {
          acc[curr._id ? 'resolved' : 'unresolved'] = curr.count;
          return acc;
        }, {}),
        anomaliesOverTime,
        topEndpointsWithAnomalies: populatedTopEndpoints
      }
    });
  } catch (error) {
    logger.error(`Error getting anomaly statistics: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error retrieving anomaly statistics',
      error: error.message
    });
  }
};

/**
 * Get system overview statistics
 * @route GET /api/analytics/overview
 * @access Private
 */
exports.getSystemOverview = async (req, res) => {
  try {
    // Count of endpoints by status
    const endpointsByStatus = await Endpoint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Count of applications by status
    const applicationsByStatus = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Count of firewall rules by action
    const firewallRulesByAction = await FirewallRule.aggregate([
      { $group: { _id: '$action', count: { $sum: 1 } } }
    ]);
    
    // Count of enabled vs disabled firewall rules
    const firewallRulesByEnabled = await FirewallRule.aggregate([
      { $group: { _id: '$enabled', count: { $sum: 1 } } }
    ]);
    
    // Recent anomalies (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const recentAnomalies = await Anomaly.find({ 
      timestamp: { $gte: yesterday } 
    })
    .sort({ timestamp: -1 })
    .limit(5)
    .populate('endpointId', 'hostname ipAddress')
    .populate('applicationId', 'name');
    
    // Recent traffic logs (last hour)
    const lastHour = new Date();
    lastHour.setHours(lastHour.getHours() - 1);
    
    const recentTrafficLogs = await TrafficLog.find({ 
      timestamp: { $gte: lastHour } 
    })
    .sort({ timestamp: -1 })
    .limit(5)
    .populate('endpointId', 'hostname ipAddress')
    .populate('applicationId', 'name');
    
    res.status(200).json({
      success: true,
      data: {
        endpoints: {
          total: await Endpoint.countDocuments(),
          byStatus: endpointsByStatus.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
          }, {})
        },
        applications: {
          total: await Application.countDocuments(),
          byStatus: applicationsByStatus.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
          }, {})
        },
        firewallRules: {
          total: await FirewallRule.countDocuments(),
          byAction: firewallRulesByAction.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
          }, {}),
          byEnabled: firewallRulesByEnabled.reduce((acc, curr) => {
            acc[curr._id ? 'enabled' : 'disabled'] = curr.count;
            return acc;
          }, {})
        },
        anomalies: {
          total: await Anomaly.countDocuments(),
          recent: recentAnomalies
        },
        trafficLogs: {
          total: await TrafficLog.countDocuments(),
          recent: recentTrafficLogs
        }
      }
    });
  } catch (error) {
    logger.error(`Error getting system overview: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error retrieving system overview',
      error: error.message
    });
  }
};
