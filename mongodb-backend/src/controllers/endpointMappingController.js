const { EndpointApplicationMapping, Endpoint, Application } = require('../models');
const logger = require('../utils/logger');

/**
 * Get all endpoint-application mappings
 * @route GET /api/mapping
 * @access Private
 */
exports.getAllMappings = async (req, res) => {
  try {
    const mappings = await EndpointApplicationMapping.find()
      .populate('endpointId', 'hostname ipAddress status')
      .populate('applicationId', 'name description status');

    res.status(200).json({
      success: true,
      count: mappings.length,
      data: mappings
    });
  } catch (error) {
    logger.error(`Error getting mappings: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error retrieving mappings',
      error: error.message
    });
  }
};

/**
 * Get mappings by endpoint ID
 * @route GET /api/mapping/endpoint/:endpointId
 * @access Private
 */
exports.getMappingsByEndpoint = async (req, res) => {
  try {
    const { endpointId } = req.params;

    // Check if endpoint exists
    const endpoint = await Endpoint.findById(endpointId);
    if (!endpoint) {
      return res.status(404).json({
        success: false,
        message: 'Endpoint not found'
      });
    }

    const mappings = await EndpointApplicationMapping.find({ endpointId })
      .populate('applicationId', 'name description status');

    res.status(200).json({
      success: true,
      count: mappings.length,
      data: mappings
    });
  } catch (error) {
    logger.error(`Error getting mappings by endpoint: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error retrieving mappings',
      error: error.message
    });
  }
};

/**
 * Get mappings by application ID
 * @route GET /api/mapping/application/:applicationId
 * @access Private
 */
exports.getMappingsByApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    // Check if application exists
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const mappings = await EndpointApplicationMapping.find({ applicationId })
      .populate('endpointId', 'hostname ipAddress status');

    res.status(200).json({
      success: true,
      count: mappings.length,
      data: mappings
    });
  } catch (error) {
    logger.error(`Error getting mappings by application: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error retrieving mappings',
      error: error.message
    });
  }
};

/**
 * Create new endpoint-application mapping
 * @route POST /api/mapping
 * @access Private
 */
exports.createMapping = async (req, res) => {
  try {
    const { endpointId, applicationId } = req.body;

    // Check if endpoint exists
    const endpoint = await Endpoint.findById(endpointId);
    if (!endpoint) {
      return res.status(404).json({
        success: false,
        message: 'Endpoint not found'
      });
    }

    // Check if application exists
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if mapping already exists
    const existingMapping = await EndpointApplicationMapping.findOne({
      endpointId,
      applicationId
    });

    if (existingMapping) {
      return res.status(400).json({
        success: false,
        message: 'Mapping already exists'
      });
    }

    // Create new mapping
    const mapping = new EndpointApplicationMapping({
      endpointId,
      applicationId,
      status: 'active'
    });

    await mapping.save();

    // Update endpoint's applicationIds array
    if (!endpoint.applicationIds.includes(applicationId)) {
      endpoint.applicationIds.push(applicationId);
      await endpoint.save();
    }

    logger.info(`New mapping created: Endpoint ${endpoint.hostname} to Application ${application.name}`);

    res.status(201).json({
      success: true,
      message: 'Mapping created successfully',
      data: mapping
    });
  } catch (error) {
    logger.error(`Error creating mapping: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error creating mapping',
      error: error.message
    });
  }
};

/**
 * Update mapping status
 * @route PATCH /api/mapping/:id
 * @access Private
 */
exports.updateMappingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const mapping = await EndpointApplicationMapping.findById(req.params.id);

    if (!mapping) {
      return res.status(404).json({
        success: false,
        message: 'Mapping not found'
      });
    }

    mapping.status = status;
    await mapping.save();

    logger.info(`Mapping status updated: ${mapping._id} (${status})`);

    res.status(200).json({
      success: true,
      message: 'Mapping status updated successfully',
      data: mapping
    });
  } catch (error) {
    logger.error(`Error updating mapping status: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating mapping status',
      error: error.message
    });
  }
};

/**
 * Delete mapping
 * @route DELETE /api/mapping/:id
 * @access Private
 */
exports.deleteMapping = async (req, res) => {
  try {
    const mapping = await EndpointApplicationMapping.findById(req.params.id);

    if (!mapping) {
      return res.status(404).json({
        success: false,
        message: 'Mapping not found'
      });
    }

    // Remove application from endpoint's applicationIds array
    const endpoint = await Endpoint.findById(mapping.endpointId);
    if (endpoint) {
      endpoint.applicationIds = endpoint.applicationIds.filter(
        id => id.toString() !== mapping.applicationId.toString()
      );
      await endpoint.save();
    }

    // Delete the mapping
    await mapping.deleteOne();

    logger.info(`Mapping deleted: ${mapping._id}`);

    res.status(200).json({
      success: true,
      message: 'Mapping deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting mapping: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting mapping',
      error: error.message
    });
  }
};
