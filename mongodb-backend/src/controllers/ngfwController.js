const { Endpoint, Application, Log } = require('../models');
const logger = require('../utils/logger');

/**
 * Authenticate endpoint for NGFW
 * @route POST /api/endpoints/authenticate
 * @access Public (No JWT required)
 */
exports.authenticateEndpoint = async (req, res) => {
  try {
    const { endpoint_name, password } = req.body;

    if (!endpoint_name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Endpoint name and password are required'
      });
    }

    // Find endpoint by hostname and include password for verification
    const endpoint = await Endpoint.findOne({ hostname: endpoint_name }).select('+password');

    if (!endpoint) {
      return res.status(401).json({
        success: false,
        message: 'Endpoint not found'
      });
    }

    // Compare hashed password
    const isPasswordValid = await endpoint.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update endpoint status and last heartbeat
    endpoint.status = 'online';
    endpoint.lastHeartbeat = new Date();
    await endpoint.save();

    logger.info(`NGFW endpoint authenticated: ${endpoint_name} (${endpoint._id})`);

    res.status(200).json({
      status: 'success',
      endpoint_id: endpoint._id
    });
  } catch (error) {
    logger.error(`NGFW endpoint authentication error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      error: error.message
    });
  }
};

/**
 * Submit applications data from NGFW endpoint
 * @route POST /api/endpoints/applications
 * @access Public (No JWT required)
 */
exports.submitApplications = async (req, res) => {
  try {
    const { endpoint_id, applications } = req.body;

    if (!endpoint_id || !applications) {
      return res.status(400).json({
        success: false,
        message: 'Endpoint ID and applications data are required'
      });
    }

    // Verify endpoint exists
    const endpoint = await Endpoint.findById(endpoint_id);
    if (!endpoint) {
      return res.status(404).json({
        success: false,
        message: 'Endpoint not found'
      });
    }

    // Process each application
    const savedApplications = [];
    for (const [processName, appData] of Object.entries(applications)) {
      try {
        // Update or create application record
        const applicationData = {
          endpointId: endpoint_id,
          name: processName, // Use processName as name for compatibility
          processName: processName,
          description: appData.description || '',
          status: appData.status || 'running',
          associated_ips: appData.associated_ips || [],
          source_ports: appData.source_ports || [],
          destination_ports: appData.destination_ports || [],
          lastUpdated: new Date()
        };

        const savedApp = await Application.findOneAndUpdate(
          { endpointId: endpoint_id, processName: processName },
          applicationData,
          { upsert: true, new: true }
        );

        savedApplications.push(savedApp);
      } catch (appError) {
        logger.error(`Error processing application ${processName}: ${appError.message}`);
      }
    }

    // Update endpoint's last heartbeat
    endpoint.lastHeartbeat = new Date();
    await endpoint.save();

    logger.info(`Applications submitted for endpoint ${endpoint.hostname}: ${savedApplications.length} applications processed`);

    res.status(200).json({
      status: 'success',
      message: 'Application information saved',
      processed_applications: savedApplications.length
    });
  } catch (error) {
    logger.error(`Error submitting applications: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error processing application data',
      error: error.message
    });
  }
};

module.exports = exports;
