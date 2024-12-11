const express = require('express');
const router = express.Router();
const {
  createMapping,
  getAllMappings,
  getMapping,
  updateMapping, // Ensure this is imported correctly
  deleteMapping,  // Make sure deleteMapping is also imported
} = require('../controllers/endpointMappingController');


// API Endpoints
router.post('/', createMapping);         // Create a mapping
router.get('/', getAllMappings);         // Get all mappings
router.get('/:id', getMapping);         // Get a specific mapping by ID
router.put('/:endpoint_id/:application_id', updateMapping); // Update mapping by ID
router.delete('/:endpoint_id/:application_id', deleteMapping); // Delete a mapping by ID

module.exports = router;
