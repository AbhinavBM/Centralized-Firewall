const express = require('express');
const router = express.Router();
const endpointController = require('../controllers/endpointController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect all routes
router.use(authMiddleware.protect);

// Endpoint routes
router.route('/')
  .get(endpointController.getAllEndpoints)
  .post(endpointController.createEndpoint);

// Statistics route
router.get('/stats', endpointController.getEndpointStats);

router.route('/:id')
  .get(endpointController.getEndpointById)
  .put(endpointController.updateEndpoint)
  .delete(endpointController.deleteEndpoint);

router.patch('/:id/status', endpointController.updateEndpointStatus);

module.exports = router;
