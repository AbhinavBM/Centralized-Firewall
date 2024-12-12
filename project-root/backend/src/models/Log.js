const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust path to your database config

const Log = sequelize.define('PacketLogs', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  source_ip: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  destination_ip: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  source_port: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  destination_port: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  protocol: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  source_service: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  destination_service: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  domain: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  logged_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'PacketLogs',
  timestamps: false, // No createdAt/updatedAt columns
});

module.exports = Log;
