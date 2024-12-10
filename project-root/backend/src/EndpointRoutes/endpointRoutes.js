const express = require('express');
const { verifyEndpoint } = require('../EndpointControllers/endpointController');

const router = express.Router();

// Route to verify endpoint authentication
router.post('/verify-endpoint', verifyEndpoint);

module.exports = router;
