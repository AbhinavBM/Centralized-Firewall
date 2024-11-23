const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/env');

// Helper function to generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// Signup controller
const signup = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            username,
            password_hash: passwordHash,
            role,
        });

        // Generate JWT token
        const token = generateToken(user);

        // Return response
        res.status(201).json({
            message: 'User created successfully',
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login controller
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = generateToken(user);

        // Return response with token
        res.status(200).json({
            message: 'Login successful',
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Logout controller
const logout = (req, res) => {
    // Invalidate the token on client-side (this is handled by frontend)
    res.status(200).json({ message: 'Logout successful' });
};

module.exports = {
    login,
    signup,
    logout,
};
