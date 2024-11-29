const { Sequelize } = require('sequelize');
const config = require('./default');

// Initialize sequelize instance
const sequelize = new Sequelize(config.database.database, config.database.user, config.database.password, {
    host: config.database.host,
    dialect: config.database.dialect,
    logging: process.env.LOG_LEVEL === 'debug', // Log SQL queries if debug level is enabled
    define: {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

// Test the connection
const authenticate = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, authenticate };
