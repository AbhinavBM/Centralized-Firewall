const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Application = require('./Application');
const Endpoint = require('./Endpoint');
const EndpointApplicationMapping = require('./EndpointApplicationMapping');

// Define Relationships
Application.belongsToMany(Endpoint, {
  through: EndpointApplicationMapping,
  as: 'endpoints',
  foreignKey: 'application_id',
});

Endpoint.belongsToMany(Application, {
  through: EndpointApplicationMapping,
  as: 'applications',
  foreignKey: 'endpoint_id',
});

// Sync the database
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
}).catch(err => {
  console.error('Error syncing database:', err);
});

module.exports = {
  sequelize,
  Application,
  Endpoint,
  EndpointApplicationMapping,
};
