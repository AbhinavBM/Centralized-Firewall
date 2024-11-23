const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middlewares/authMiddleware'); // Import JWT middleware
const {
    createApplication,
    updateApplication,
    deleteApplication,
    getApplications,
} = require('../controllers/applicationController');

// Application routes with authentication middleware
router.post('/', authenticateJWT, createApplication);       // Add a new application
router.get('/', authenticateJWT, getApplications);          // Fetch all applications
router.put('/:id', authenticateJWT, updateApplication);     // Update application by ID
router.delete('/:id', authenticateJWT, deleteApplication);  // Delete application by ID

module.exports = router;
