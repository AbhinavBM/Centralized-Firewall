const { Sequelize } = require('sequelize');
const config = require('./default'); // Assuming it exports DB_CONFIG

const sequelize = new Sequelize(
    config.DB_CONFIG.database,
    config.DB_CONFIG.user,
    config.DB_CONFIG.password,
    {
        host: config.DB_CONFIG.host,
        dialect: config.DB_CONFIG.dialect,
        logging: process.env.LOG_LEVEL === 'debug',
    }
);

// sequelize
//     .authenticate()
//     .then(() => console.log('Database connected successfully.'))
//     .catch((err) => console.error('Database connection failed:', err));

module.exports = sequelize;
