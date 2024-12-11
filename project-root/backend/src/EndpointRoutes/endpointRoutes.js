const express = require('express');
const ApplicationPostController = require('../EndpointControllers/ApplicationPostController');
const ApplicationGetController = require('../EndpointControllers/ApplicationGetController');

const { verifyEndpoint } = require('../EndpointControllers/endpointController');

const router = express.Router();

// Route to verify endpoint authentication
router.post('/verify-endpoint', verifyEndpoint);

// Route to save applications and their mappings
router.post('/applications/save', ApplicationPostController.saveApplicationsWithMapping);
router.get('/applications/:endpoint_id', ApplicationGetController.getApplicationsByEndpoint);

module.exports = router;
