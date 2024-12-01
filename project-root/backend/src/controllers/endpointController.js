const Endpoint = require('../models/Endpoint');

// Create a new endpoint
const createEndpoint = async (req, res) => {
    const { hostname, os, ip_address, status, password } = req.body;

    try {
        if (!hostname || !ip_address || !status) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newEndpoint = await Endpoint.create({ hostname, os, ip_address, status, password });
        return res.status(201).json(newEndpoint);
    } catch (error) {
        console.error('Error creating endpoint:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all endpoints
const getEndpoints = async (req, res) => {
    try {
        const endpoints = await Endpoint.findAll();
        return res.status(200).json(endpoints);
    } catch (error) {
        console.error('Error fetching endpoints:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update an endpoint by ID
const updateEndpoint = async (req, res) => {
    const { id } = req.params;
    const { hostname, os, ip_address, status, password } = req.body;

    try {
        const endpoint = await Endpoint.findByPk(id);
        if (!endpoint) {
            return res.status(404).json({ message: 'Endpoint not found' });
        }

        await endpoint.update({ hostname, os, ip_address, status, password });
        return res.status(200).json(endpoint);
    } catch (error) {
        console.error('Error updating endpoint:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete an endpoint by ID
const deleteEndpoint = async (req, res) => {
    const { id } = req.params;

    try {
        const endpoint = await Endpoint.findByPk(id);
        if (!endpoint) {
            return res.status(404).json({ message: 'Endpoint not found' });
        }

        await endpoint.destroy();
        return res.status(200).json({ message: 'Endpoint deleted successfully' });
    } catch (error) {
        console.error('Error deleting endpoint:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createEndpoint,
    getEndpoints,
    updateEndpoint,
    deleteEndpoint,
};
