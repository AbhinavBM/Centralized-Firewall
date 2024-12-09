const Application = require('../models/Application');

exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.findAll();
    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: 'No applications found' });
    }
    res.status(200).json(applications);
  } catch (err) {
    console.error(err); // For debugging purposes
    res.status(500).json({ error: 'An error occurred while retrieving applications' });
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
    console.error(err); // For debugging purposes
    res.status(500).json({ error: 'An error occurred while retrieving the application' });
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
    console.error(err); // For debugging purposes
    res.status(500).json({ error: 'An error occurred while creating the application' });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Ensure valid input data before updating
    if (!req.body.name || !req.body.description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    await application.update(req.body);
    res.status(200).json(application);
  } catch (err) {
    console.error(err); // For debugging purposes
    res.status(500).json({ error: 'An error occurred while updating the application' });
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
    console.error(err); // For debugging purposes
    res.status(500).json({ error: 'An error occurred while deleting the application' });
  }
};
