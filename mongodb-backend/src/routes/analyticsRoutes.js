const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect all routes
router.use(authMiddleware.protect);

// Analytics routes
router.get('/traffic', analyticsController.getTrafficStats);
router.get('/anomalies', analyticsController.getAnomalyStats);
router.get('/overview', analyticsController.getSystemOverview);

module.exports = router;
