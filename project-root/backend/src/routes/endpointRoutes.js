const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middlewares/authMiddleware'); // Import JWT middleware
const {
    createEndpoint,
    getEndpoints,
    updateEndpoint,
    deleteEndpoint,
} = require('../controllers/endpointController');

// Define routes
router.post('/', createEndpoint);
router.get('/', getEndpoints);
router.put('/:id', updateEndpoint);
router.delete('/:id', deleteEndpoint);

module.exports = router;
