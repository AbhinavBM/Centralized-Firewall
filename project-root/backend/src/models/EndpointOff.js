const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Application = require('./Application'); // Correct path for Application
const EndpointApplicationMapping = require('./EndpointApplicationMapping'); // Correct path for EndpointApplicationMapping

const EndpointOff = sequelize.define('Endpoint', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  hostname: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  os: {
    type: DataTypes.STRING(255),
  },
  ip_address: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Ensure that 'Application' is a valid model
EndpointOff.belongsToMany(Application, {
  through: EndpointApplicationMapping,
  foreignKey: 'endpoint_id',
  otherKey: 'application_id',
});

module.exports = EndpointOff;
