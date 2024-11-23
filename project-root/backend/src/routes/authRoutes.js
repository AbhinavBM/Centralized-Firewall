const express = require('express');
const router = express.Router();
const {
    login,
    signup,
    logout,
} = require('../controllers/authController');

// Auth routes
router.post('/login', login);  // User login
router.post('/signup', signup); // User registration
router.post('/logout', logout); // User logout

module.exports = router;
