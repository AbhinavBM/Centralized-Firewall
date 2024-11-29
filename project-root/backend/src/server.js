const app = require('./app'); // Import the Express app
const { sequelize, authenticate } = require('../src/config/database'); // Sequelize instance

const PORT = process.env.PORT || 3000; // Set the port from env variable or default

const startServer = async () => {
    try {
        await authenticate(); // Check database connection
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1); // Exit if database connection fails
    }
};

startServer();
