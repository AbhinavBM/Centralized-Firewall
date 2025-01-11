const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    allowNull: false,
  },
  allowed_domains: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
  },
  allowed_ips: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
  },
  allowed_protocols: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
  },
  firewall_policies: {
    type: DataTypes.JSONB,
  },
}, {
  tableName: 'applications',
  timestamps: true,
});





module.exports = Application;