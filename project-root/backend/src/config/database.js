const { Sequelize } = require('sequelize');
const config = require('./default');

const sequelize = new Sequelize(
    config.DB_CONFIG.database,
    config.DB_CONFIG.user,
    config.DB_CONFIG.password,
    {
        host: config.DB_CONFIG.host,
        dialect: config.DB_CONFIG.dialect,
        logging: false, // Disable SQL query logs
    }
);

sequelize
    .authenticate()
    .then(() => console.log('PostgreSQL connected successfully.'))
    .catch((err) => console.error('Unable to connect to PostgreSQL:', err));

module.exports = sequelize;
