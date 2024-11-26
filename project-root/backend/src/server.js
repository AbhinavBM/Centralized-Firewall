const app = require('./app'); // Import the configured Express app
const sequelize = require('../src/config/database'); // Sequelize instance for database connection

// Get the port from environment variables or use default
const PORT = process.env.PORT || 3000;

// Start the server
const startServer = async () => {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        // Start listening on the specified port
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1); // Exit on failure
    }
};

startServer();
