const mongoose = require('mongoose');
const logger = require('../utils/logger');

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/centralized-firewall';

// Connect to MongoDB
const connectDB = async () => {
  try {
    logger.info(`Connecting to MongoDB with URI: ${MONGODB_URI.replace(/:[^:]*@/, ':****@')}`);
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('MongoDB connected successfully');
    return true;
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    logger.error(`Full error: ${JSON.stringify(error)}`);
    return false;
  }
};

// Disconnect from MongoDB
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
    return true;
  } catch (error) {
    logger.error(`MongoDB disconnection error: ${error.message}`);
    return false;
  }
};

// Export the connection functions
module.exports = {
  connectDB,
  disconnectDB,
  mongoose
};
