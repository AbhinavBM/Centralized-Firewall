const express = require('express');
const router = express.Router();
const logsController = require('../controllers/logsController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect all routes
router.use(authMiddleware.protect);

// Traffic logs routes
router.route('/traffic')
  .get(logsController.getTrafficLogs)
  .post(logsController.createTrafficLog);

router.get('/traffic/endpoint/:endpointId', logsController.getTrafficLogsByEndpoint);
router.get('/traffic/application/:applicationId', logsController.getTrafficLogsByApplication);

// System logs routes
router.route('/system')
  .get(logsController.getSystemLogs)
  .post(logsController.createSystemLog);

module.exports = router;
