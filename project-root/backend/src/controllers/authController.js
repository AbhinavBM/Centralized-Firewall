const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Signup controller
const signup = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const userExists = await User.findOne({ where: { username } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const password_hash = await bcrypt.hash(password, 10);

        const newUser = await User.create({ username, password_hash, role });

        const token = jwt.sign({ userId: newUser.id }, 'your-jwt-secret', { expiresIn: '1h' });

        res.status(201).json({ token, user: { username: newUser.username, role: newUser.role } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Login controller
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, 'your-jwt-secret', { expiresIn: '1h' });

        res.status(200).json({ token, user: { username: user.username, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { signup, login };
