const { Application, EndpointApplicationMapping, FirewallRule } = require('../models');
const logger = require('../utils/logger');

/**
 * Get all applications
 * @route GET /api/applications
 * @access Private
 */
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find();
    
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    logger.error(`Error getting applications: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error retrieving applications',
      error: error.message
    });
  }
};

/**
 * Get single application by ID
 * @route GET /api/applications/:id
 * @access Private
 */
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    logger.error(`Error getting application: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error retrieving application',
      error: error.message
    });
  }
};

/**
 * Create new application
 * @route POST /api/applications
 * @access Private
 */
exports.createApplication = async (req, res) => {
  try {
    const {
      name,
      description,
      status,
      allowedDomains,
      allowedIps,
      allowedProtocols,
      firewallPolicies
    } = req.body;
    
    // Check if application with same name already exists
    const existingApplication = await Application.findOne({ name });
    
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'Application with this name already exists'
      });
    }
    
    // Create new application
    const application = new Application({
      name,
      description,
      status: status || 'pending',
      allowedDomains: allowedDomains || [],
      allowedIps: allowedIps || [],
      allowedProtocols: allowedProtocols || [],
      firewallPolicies: firewallPolicies || {}
    });
    
    await application.save();
    
    logger.info(`New application created: ${name}`);
    
    res.status(201).json({
      success: true,
      message: 'Application created successfully',
      data: application
    });
  } catch (error) {
    logger.error(`Error creating application: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error creating application',
      error: error.message
    });
  }
};

/**
 * Update application
 * @route PUT /api/applications/:id
 * @access Private
 */
exports.updateApplication = async (req, res) => {
  try {
    const {
      name,
      description,
      status,
      allowedDomains,
      allowedIps,
      allowedProtocols,
      firewallPolicies
    } = req.body;
    
    // Find application by ID
    let application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Check if updating to an existing name (that's not this application's)
    if (name) {
      const existingApplication = await Application.findOne({
        _id: { $ne: req.params.id },
        name
      });
      
      if (existingApplication) {
        return res.status(400).json({
          success: false,
          message: 'Another application with this name already exists'
        });
      }
    }
    
    // Update application
    application.name = name || application.name;
    application.description = description || application.description;
    application.status = status || application.status;
    
    if (allowedDomains) application.allowedDomains = allowedDomains;
    if (allowedIps) application.allowedIps = allowedIps;
    if (allowedProtocols) application.allowedProtocols = allowedProtocols;
    if (firewallPolicies) application.firewallPolicies = firewallPolicies;
    
    await application.save();
    
    logger.info(`Application updated: ${application.name}`);
    
    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: application
    });
  } catch (error) {
    logger.error(`Error updating application: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating application',
      error: error.message
    });
  }
};

/**
 * Delete application
 * @route DELETE /api/applications/:id
 * @access Private
 */
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Delete all mappings associated with this application
    await EndpointApplicationMapping.deleteMany({ applicationId: req.params.id });
    
    // Delete all firewall rules associated with this application
    await FirewallRule.deleteMany({ applicationId: req.params.id });
    
    // Delete the application
    await application.deleteOne();
    
    logger.info(`Application deleted: ${application.name}`);
    
    res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting application: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting application',
      error: error.message
    });
  }
};
