const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

// List applications mapped to an endpoint

exports.getApplicationsByEndpoint = async (req, res) => {
    try {
        const { endpoint_id } = req.params; // Extract endpoint_id from the request parameters

        const applications = await sequelize.query(
            `SELECT a.id, a.name, a.description
             FROM endpoint_application_mapping eam
             JOIN applications a ON eam.application_id = a.id
             WHERE eam.endpoint_id = :endpoint_id`, // Use a named parameter
            {
                replacements: { endpoint_id }, // Replace the named parameter with actual value
                type: sequelize.QueryTypes.SELECT, // Specify the query type
            }
        );

        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ error: 'An error occurred while fetching applications.' });
    }
};

// Add application to an endpoint
exports.addApplicationToEndpoint = async (req, res) => {
    const { endpoint_id } = req.params;
    const { application_id } = req.body;
    try {
        await sequelize.query(
            `INSERT INTO endpoint_application_mapping (endpoint_id, application_id) 
             VALUES (:endpointId, :applicationId) 
             ON CONFLICT DO NOTHING`,
            { replacements: { endpointId: endpoint_id, applicationId: application_id }, type: QueryTypes.INSERT }
        );
        res.status(201).json({ message: 'Application added successfully' });
    } catch (error) {
        console.error('Error adding application:', error);
        res.status(500).json({ message: 'Failed to add application' });
    }
};

// Remove application from an endpoint
exports.removeApplicationFromEndpoint = async (req, res) => {
    const { endpoint_id, application_id } = req.params;
    try {
        await sequelize.query(
            `DELETE FROM endpoint_application_mapping 
             WHERE endpoint_id = :endpointId AND application_id = :applicationId`,
            { replacements: { endpointId: endpoint_id, applicationId: application_id }, type: QueryTypes.DELETE }
        );
        res.status(200).json({ message: 'Application removed successfully' });
    } catch (error) {
        console.error('Error removing application:', error);
        res.status(500).json({ message: 'Failed to remove application' });
    }
};

// Get all available applications
exports.getAllApplications = async (req, res) => {
    try {
        const applications = await sequelize.query(
            `SELECT id, name, description FROM applications`,
            { type: QueryTypes.SELECT }
        );
        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Failed to fetch applications' });
    }
};



// Search for applications based on a search query
exports.searchApplications = async (req, res) => {
    const { query } = req.query; // Get the search query from the query parameters
    try {
        const applications = await sequelize.query(
            `SELECT id, name, description 
             FROM applications 
             WHERE name ILIKE :query OR description ILIKE :query`, // ILIKE for case-insensitive search
            {
                replacements: { query: `%${query}%` },
                type: QueryTypes.SELECT,
            }
        );
        res.status(200).json(applications);
    } catch (error) {
        console.error('Error searching applications:', error);
        res.status(500).json({ message: 'Failed to search applications' });
    }
};

// Update application status for a specific endpoint
exports.updateApplicationStatus = async (req, res) => {
    const { endpoint_id, application_id } = req.params;
    const { status } = req.body; // Expect status to be passed in the request body (e.g., "Allowed" or "Blocked")
    try {
        await sequelize.query(
            `UPDATE endpoint_application_mapping 
             SET status = :status 
             WHERE endpoint_id = :endpointId AND application_id = :applicationId`,
            {
                replacements: { status, endpointId: endpoint_id, applicationId: application_id },
                type: QueryTypes.UPDATE,
            }
        );
        res.status(200).json({ message: 'Application status updated successfully' });
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({ message: 'Failed to update application status' });
    }
};

