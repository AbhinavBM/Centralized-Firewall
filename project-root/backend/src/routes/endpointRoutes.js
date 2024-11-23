const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middlewares/authMiddleware'); // Import JWT middleware
const {
    createEndpoint,
    updateEndpoint,
    deleteEndpoint,
    getEndpoints,
} = require('../controllers/endpointController');

// Endpoint routes with authentication middleware
router.post('/', authenticateJWT, createEndpoint);        // Create a new endpoint
router.get('/', authenticateJWT, getEndpoints);          // Fetch all endpoints
router.put('/:id', authenticateJWT, updateEndpoint);     // Update an endpoint by ID
router.delete('/:id', authenticateJWT, deleteEndpoint);  // Delete an endpoint by ID

module.exports = router;
