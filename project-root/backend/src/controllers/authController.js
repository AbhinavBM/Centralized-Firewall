const { signupService, loginService, logoutService } = require('../services/authService');

// Signup controller
const signup = async (req, res) => {
    try {
        const result = await signupService(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Login controller
const login = async (req, res) => {
    try {
        const result = await loginService(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: 'Invalid credentials' });
    }
};

// Logout controller
const logout = (req, res) => {
    logoutService();
    res.status(200).json({ message: 'Logout successful' });
};

module.exports = {
    signup,
    login,
    logout,
};
