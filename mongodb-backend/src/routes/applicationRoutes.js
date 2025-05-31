const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect all routes
router.use(authMiddleware.protect);

// Application routes
router.route('/')
  .get(applicationController.getAllApplications)
  .post(applicationController.createApplication);

// Statistics route
router.get('/stats', applicationController.getApplicationStats);

// Endpoint-specific routes
router.get('/endpoint/:endpointId', applicationController.getApplicationsByEndpoint);

router.route('/:id')
  .get(applicationController.getApplicationById)
  .put(applicationController.updateApplication)
  .delete(applicationController.deleteApplication);

module.exports = router;
