require('dotenv').config();

const config = require('./default');

module.exports = {
  port: config.port,
  jwtSecret: config.jwtSecret,
  databaseConfig: config.database,
};
