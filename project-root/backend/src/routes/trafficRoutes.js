const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middlewares/authMiddleware'); // Import JWT middleware
const {
    getTrafficLogs,
    analyzeTraffic,
} = require('../controllers/trafficController');

// Traffic log routes with authentication middleware
router.get('/', authenticateJWT, getTrafficLogs);         // Fetch all traffic logs
router.post('/analyze', authenticateJWT, analyzeTraffic); // Analyze traffic (e.g., detect anomalies)

module.exports = router;
