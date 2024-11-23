const jwt = require('jsonwebtoken');

// Middleware to validate JWT
const authenticateJWT = (req, res, next) => {
    // Get the token from the authorization header
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Access Denied: No Token Provided' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Access Denied: Invalid Token' });
        }

        // Attach the user information to the request object
        req.user = user;

        // Pass control to the next middleware or route handler
        next();
    });
};

module.exports = authenticateJWT;
