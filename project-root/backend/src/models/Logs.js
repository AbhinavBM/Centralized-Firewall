const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');


const Log = sequelize.define('Log', {
    endpoint_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    source_ip: {
        type: DataTypes.STRING,
        allowNull: false
    },
    destination_ip: {
        type: DataTypes.STRING,
        allowNull: false
    },
    source_port: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    destination_port: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    protocol: {
        type: DataTypes.STRING,
        allowNull: false
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'logs',
    timestamps: false // Disable Sequelize's default `createdAt` and `updatedAt` fields
});

module.exports = Log;
