const { Application, Endpoint } = require('../models'); // Assuming you have all models properly imported

// Create a new application
const createApplication = async (req, res) => {
    try {
        const { endpoint_id, name, status } = req.body;

        // Ensure the endpoint exists before creating the application
        const endpoint = await Endpoint.findByPk(endpoint_id);
        if (!endpoint) {
            return res.status(404).json({ message: 'Endpoint not found' });
        }

        const newApplication = await Application.create({
            endpoint_id,
            name,
            status,
        });

        return res.status(201).json({
            message: 'Application created successfully',
            application: newApplication,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error creating application' });
    }
};

// Get all applications
const getApplications = async (req, res) => {
    try {
        const applications = await Application.findAll({
            include: [
                {
                    model: Endpoint, // Include associated endpoint information
                    required: true,
                },
            ],
        });
        return res.status(200).json(applications);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching applications' });
    }
};

// Update an application by ID
const updateApplication = async (req, res) => {
    const { id } = req.params;
    const { endpoint_id, name, status } = req.body;

    try {
        // Find the application by ID
        const application = await Application.findByPk(id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if the endpoint exists
        const endpoint = await Endpoint.findByPk(endpoint_id);
        if (!endpoint) {
            return res.status(404).json({ message: 'Endpoint not found' });
        }

        // Update the application details
        application.endpoint_id = endpoint_id || application.endpoint_id;
        application.name = name || application.name;
        application.status = status || application.status;

        await application.save(); // Save the changes

        return res.status(200).json({
            message: 'Application updated successfully',
            application,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating application' });
    }
};

// Delete an application by ID
const deleteApplication = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the application by ID
        const application = await Application.findByPk(id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        await application.destroy(); // Delete the application

        return res.status(200).json({
            message: 'Application deleted successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error deleting application' });
    }
};

module.exports = {
    createApplication,
    updateApplication,
    deleteApplication,
    getApplications,
};
