const Endpoint = require('../models/Endpoint'); // Import Endpoint model directly

// Controller to handle endpoint authentication
const verifyEndpoint = async (req, res) => {
    try {
        const { endpoint_name, password } = req.body;

        // Validate request payload
        if (!endpoint_name || !password) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Missing or invalid fields in the request.',
            });
        }

        // Check if the endpoint exists with the given name and password
        const endpoint = await Endpoint.findOne({
            where: {
                hostname: endpoint_name,
                password: password,
            },
        });

        // Handle invalid credentials
        if (!endpoint) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid credentials.',
            });
        }

        // Respond with endpoint ID if authentication is successful
        return res.status(200).json({
            endpoint_id: endpoint.id,
        });
    } catch (error) {
        // Handle internal server errors
        console.error('Error authenticating endpoint:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'The server encountered an error while processing the request.',
        });
    }
};

module.exports = { verifyEndpoint };
