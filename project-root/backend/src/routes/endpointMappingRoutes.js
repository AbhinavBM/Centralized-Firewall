const express = require('express');
const router = express.Router();
const {
  createMapping,
  getAllMappings,
  getMapping,
  updateMapping,
  deleteMapping,
} = require('../controllers/endpointMappingController');

// API Endpoints
router.post('/', createMapping);         // Create a mapping
router.get('/', getAllMappings);         // Get all mappings
router.get('/:id', getMapping);         // Get a specific mapping by ID
router.put(':id', updateMapping);      // Update a mapping by ID
router.delete('/:id', deleteMapping);   // Delete a mapping by ID

module.exports = router;
