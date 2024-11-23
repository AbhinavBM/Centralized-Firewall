const Endpoint = require('../models/Endpoint');

// Create a new endpoint
const createEndpoint = async (req, res) => {
    const { hostname, os, ip_address, status } = req.body;

    try {
        // Validate required fields
        if (!hostname || !ip_address || !status) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create new endpoint
        const endpoint = await Endpoint.create({
            hostname,
            os,
            ip_address,
            status,
        });

        // Respond with the created endpoint
        res.status(201).json(endpoint);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all endpoints
const getEndpoints = async (req, res) => {
    try {
        // Fetch all endpoints
        const endpoints = await Endpoint.findAll();
        
        // Respond with all the endpoints
        res.status(200).json(endpoints);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update an endpoint by ID
const updateEndpoint = async (req, res) => {
    const { id } = req.params;
    const { hostname, os, ip_address, status } = req.body;

    try {
        // Find the endpoint to update
        const endpoint = await Endpoint.findByPk(id);
        if (!endpoint) {
            return res.status(404).json({ message: 'Endpoint not found' });
        }

        // Update the endpoint
        endpoint.hostname = hostname || endpoint.hostname;
        endpoint.os = os || endpoint.os;
        endpoint.ip_address = ip_address || endpoint.ip_address;
        endpoint.status = status || endpoint.status;

        await endpoint.save();

        // Respond with the updated endpoint
        res.status(200).json(endpoint);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete an endpoint by ID
const deleteEndpoint = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the endpoint to delete
        const endpoint = await Endpoint.findByPk(id);
        if (!endpoint) {
            return res.status(404).json({ message: 'Endpoint not found' });
        }

        // Delete the endpoint
        await endpoint.destroy();

        // Respond with a success message
        res.status(200).json({ message: 'Endpoint deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createEndpoint,
    updateEndpoint,
    deleteEndpoint,
    getEndpoints,
};
