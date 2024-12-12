const Application = require('../models/Application');

exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.findAll();
    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: 'No applications found' });
    }
    res.status(200).json(applications);
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ error: 'An error occurred while retrieving applications', details: err.message });
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json(application);
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ error: 'An error occurred while retrieving the application', details: err.message });
  }
};

exports.createApplication = async (req, res) => {
  try {
    // Ensure valid input data
    if (!req.body.name || !req.body.description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    const application = await Application.create(req.body);
    res.status(201).json(application);
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ error: 'An error occurred while creating the application', details: err.message });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Prepare an object to hold the updated data
    const updatedData = {};

    // Only update fields if they are provided in the request body
    if (req.body.name) updatedData.name = req.body.name;
    if (req.body.description) updatedData.description = req.body.description;
    if (req.body.status) updatedData.status = req.body.status;
    if (req.body.allowed_domains) updatedData.allowed_domains = req.body.allowed_domains;
    if (req.body.allowed_ips) updatedData.allowed_ips = req.body.allowed_ips;
    if (req.body.allowed_protocols) updatedData.allowed_protocols = req.body.allowed_protocols;
    if (req.body.firewall_policies) updatedData.firewall_policies = req.body.firewall_policies;

    // If no valid fields are provided to update, return a 400 error
    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update' });
    }

    // Update the application with the provided fields
    await application.update(updatedData);
    res.status(200).json(application);
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ error: 'An error occurred while updating the application', details: err.message });
  }
};


exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    await application.destroy();
    res.status(204).send(); // No content status for successful delete
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ error: 'An error occurred while deleting the application', details: err.message });
  }
};
