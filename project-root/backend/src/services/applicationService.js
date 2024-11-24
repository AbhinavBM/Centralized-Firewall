const { pool } = require('../config/db');

// Create a new application
const createApplicationService = async (endpoint_id, name, status) => {
    // Ensure the endpoint exists before creating the application
    const endpointResult = await pool.query('SELECT * FROM endpoints WHERE id = $1', [endpoint_id]);
    if (endpointResult.rows.length === 0) {
        throw new Error('Endpoint not found');
    }

    // Insert the new application
    const result = await pool.query(
        'INSERT INTO applications (endpoint_id, name, status) VALUES ($1, $2, $3) RETURNING *',
        [endpoint_id, name, status]
    );
    return result.rows[0];
};

// Get all applications
const getApplicationsService = async () => {
    const result = await pool.query(`
        SELECT a.*, e.* 
        FROM applications a
        JOIN endpoints e ON a.endpoint_id = e.id
    `);
    return result.rows;
};

// Update an application by ID
const updateApplicationService = async (id, endpoint_id, name, status) => {
    const result = await pool.query(
        'UPDATE applications SET endpoint_id = $1, name = $2, status = $3 WHERE id = $4 RETURNING *',
        [endpoint_id, name, status, id]
    );

    if (result.rows.length === 0) {
        throw new Error('Application not found');
    }

    return result.rows[0];
};

// Delete an application by ID
const deleteApplicationService = async (id) => {
    const result = await pool.query('SELECT * FROM applications WHERE id = $1', [id]);
    if (result.rows.length === 0) {
        throw new Error('Application not found');
    }

    // Delete the application
    await pool.query('DELETE FROM applications WHERE id = $1', [id]);
    return { message: 'Application deleted successfully' };
};

module.exports = {
    createApplicationService,
    getApplicationsService,
    updateApplicationService,
    deleteApplicationService,
};
