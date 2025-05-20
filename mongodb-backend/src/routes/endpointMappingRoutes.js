const express = require('express');
const router = express.Router();
const endpointMappingController = require('../controllers/endpointMappingController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect all routes
router.use(authMiddleware.protect);

// Mapping routes
router.route('/')
  .get(endpointMappingController.getAllMappings)
  .post(endpointMappingController.createMapping);

router.route('/:id')
  .patch(endpointMappingController.updateMappingStatus)
  .delete(endpointMappingController.deleteMapping);

router.get('/endpoint/:endpointId', endpointMappingController.getMappingsByEndpoint);
router.get('/application/:applicationId', endpointMappingController.getMappingsByApplication);

module.exports = router;
