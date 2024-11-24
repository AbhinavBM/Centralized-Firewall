const {
    createApplicationService,
    updateApplicationService,
    deleteApplicationService,
    getApplicationsService,
} = require('../services/applicationService');

// Create a new application
const createApplication = async (req, res) => {
    const { endpoint_id, name, status } = req.body;
    try {
        const application = await createApplicationService(endpoint_id, name, status);
        res.status(201).json({
            message: 'Application created successfully',
            application,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Error creating application' });
    }
};

// Get all applications
const getApplications = async (req, res) => {
    try {
        const applications = await getApplicationsService();
        res.status(200).json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Error fetching applications' });
    }
};

// Update an application by ID
const updateApplication = async (req, res) => {
    const { id } = req.params;
    const { endpoint_id, name, status } = req.body;
    try {
        const application = await updateApplicationService(id, endpoint_id, name, status);
        res.status(200).json({
            message: 'Application updated successfully',
            application,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Error updating application' });
    }
};

// Delete an application by ID
const deleteApplication = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteApplicationService(id);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Error deleting application' });
    }
};

module.exports = {
    createApplication,
    updateApplication,
    deleteApplication,
    getApplications,
};
