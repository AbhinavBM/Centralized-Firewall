const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Destructure to get the Sequelize instance

const Log = sequelize.define('Log', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  endpoint_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  source_ip: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIP: true,
    },
  },
  destination_ip: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIP: true,
    },
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
    type: DataTypes.STRING,
    allowNull: false,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['ACCEPT', 'DENY']],
    },
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'logs', // Ensures the model is tied to the correct table name
  timestamps: false,  // Since your table does not have `createdAt` and `updatedAt` columns
});

module.exports = Log;
