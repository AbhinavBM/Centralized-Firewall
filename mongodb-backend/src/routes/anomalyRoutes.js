const express = require('express');
const router = express.Router();
const anomalyController = require('../controllers/anomalyController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect all routes
router.use(authMiddleware.protect);

// Anomaly routes
router.route('/')
  .get(anomalyController.getAllAnomalies)
  .post(anomalyController.createAnomaly);

router.route('/:id')
  .get(anomalyController.getAnomalyById)
  .delete(anomalyController.deleteAnomaly);

router.patch('/:id/resolve', anomalyController.resolveAnomaly);

router.get('/endpoint/:endpointId', anomalyController.getAnomaliesByEndpoint);
router.get('/application/:applicationId', anomalyController.getAnomaliesByApplication);

module.exports = router;
