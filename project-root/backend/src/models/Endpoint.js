const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Endpoint = sequelize.define('Endpoint', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    hostname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    os: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ip_address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Prevent duplicate IPs
        validate: {
            isIP: true, // Ensures valid IP address format
        },
    },
    status: {
        type: DataTypes.ENUM('online', 'offline'),
        allowNull: false,
        defaultValue: 'offline', 

    },
    last_sync: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'endpoints',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Endpoint;
