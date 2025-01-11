const express = require('express');
const router = express.Router();
const {
    getApplicationsByEndpoint,
    addApplicationToEndpoint,
    removeApplicationFromEndpoint,
    getAllApplications,
    searchApplications

} = require('../controllers/endpointMappingController');

// List applications mapped to an endpoint
router.get('/endpoints/:endpoint_id/applications', getApplicationsByEndpoint);

// Add an application to an endpoint
router.post('/endpoints/:endpoint_id/applications', addApplicationToEndpoint);

// Remove an application from an endpoint
router.delete('/endpoints/:endpoint_id/applications/:application_id', removeApplicationFromEndpoint);

// Fetch all available applications
router.get('/applications', getAllApplications);
router.get('/applications/search', searchApplications);
module.exports = router;
