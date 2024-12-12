const express = require('express');
const router = express.Router();
const {
  createMapping,
  getAllMappings,
  getMapping,
  updateMapping,
  deleteMapping,
} = require('../controllers/endpointMappingController');

router.post('/', createMapping);
router.get('/', getAllMappings);
router.get('/:id', getMapping);
router.put('/:id', updateMapping);
router.delete('/:id', deleteMapping);

module.exports = router;
