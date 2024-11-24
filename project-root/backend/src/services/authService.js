const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { JWT_SECRET } = require('../config/env');

// Helper function to generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// Signup service
const signupService = async ({ username, password, role }) => {
    // Check if user already exists
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length > 0) {
        throw new Error('User already exists');
    }

    // Hash the password before saving to database
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const insertResult = await pool.query(
        'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
        [username, passwordHash, role]
    );

    // Generate JWT token for the new user
    const token = generateToken(insertResult.rows[0]);
    return { message: 'User created successfully', token };
};

// Login service
const loginService = async ({ username, password }) => {
    // Retrieve user from database
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
        throw new Error('Invalid credentials');
    }

    const user = result.rows[0];

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    // Generate JWT token for the logged-in user
    const token = generateToken(user);
    return { message: 'Login successful', token };
};

// Logout service
const logoutService = () => {
    // Invalidate the token on client-side (this is handled by frontend)
    // Currently, it's a placeholder for future token invalidation logic
    // Tokens on the server side are stateless, so to "logout", the client needs to delete the token
};

module.exports = {
    signupService,
    loginService,
    logoutService,
};
