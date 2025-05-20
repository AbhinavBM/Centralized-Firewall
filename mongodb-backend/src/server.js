const app = require('./app');
const http = require('http');
const { connectDB } = require('./config/database');
const logger = require('./utils/logger');
const { PORT } = require('./config/env');
const initWebSocketServer = require('./websocket/wsServer');

// Create directory for logs if it doesn't exist
const fs = require('fs');
const path = require('path');
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Start the server
const startServer = async () => {
  try {
    // Connect to MongoDB
    logger.info(`Attempting to connect to MongoDB at: ${process.env.MONGODB_URI}`);
    const connected = await connectDB();

    if (!connected) {
      logger.error('Failed to connect to MongoDB. Exiting...');
      process.exit(1);
    }

    logger.info('MongoDB connection successful');

    // Create HTTP server
    const server = http.createServer(app);

    // Initialize WebSocket server
    const wsServer = initWebSocketServer(server);

    // Make WebSocket server available globally
    global.wsServer = wsServer;

    // Start HTTP server
    server.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      logger.info('WebSocket server initialized');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error(`Unhandled Rejection: ${err.message}`);
      // Close server & exit process
      server.close(() => process.exit(1));
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      logger.error(`Uncaught Exception: ${err.message}`);
      // Close server & exit process
      server.close(() => process.exit(1));
    });

    // Handle SIGTERM signal
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
      });
    });

  } catch (error) {
    logger.error(`Server error: ${error.message}`);
    process.exit(1);
  }
};

startServer();
