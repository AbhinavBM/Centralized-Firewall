const { pool } = require('../config/db'); // Assuming pool is configured for PostgreSQL

// Create a new endpoint
const createEndpoint = async (req, res) => {
    const { hostname, os, ip_address, status, password } = req.body;

    try {
        if (!hostname || !ip_address || !status) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Insert the new endpoint, including password if provided
        const result = await pool.query(
            'INSERT INTO endpoints (hostname, os, ip_address, status, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [hostname, os, ip_address, status, password]
        );

        return res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all endpoints
const getEndpoints = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM endpoints');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update an endpoint by ID
const updateEndpoint = async (req, res) => {
    const { id } = req.params;
    const { hostname, os, ip_address, status, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM endpoints WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Endpoint not found' });
        }

        const updatedResult = await pool.query(
            'UPDATE endpoints SET hostname = $1, os = $2, ip_address = $3, status = $4, password = $5 WHERE id = $6 RETURNING *',
            [
                hostname || result.rows[0].hostname,
                os || result.rows[0].os,
                ip_address || result.rows[0].ip_address,
                status || result.rows[0].status,
                password || result.rows[0].password,
                id,
            ]
        );

        return res.status(200).json(updatedResult.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete an endpoint by ID
const deleteEndpoint = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM endpoints WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Endpoint not found' });
        }

        // Delete the endpoint
        await pool.query('DELETE FROM endpoints WHERE id = $1', [id]);

        return res.status(200).json({ message: 'Endpoint deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createEndpoint,
    getEndpoints,
    updateEndpoint,
    deleteEndpoint,
};
