const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Endpoint = require('./Endpoint');
const Application = require('./Application');

const TrafficLog = sequelize.define('TrafficLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    endpoint_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Endpoint,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    application_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: Application,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    source_ip: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    destination_ip: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    protocol: {
        type: DataTypes.ENUM('TCP', 'UDP', 'ICMP'),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('allowed', 'blocked'),
        allowNull: false,
    },
    traffic_type: {
        type: DataTypes.ENUM('inbound', 'outbound'),
        allowNull: false,
    },
    data_transferred: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
}, {
    tableName: 'traffic_logs',
    timestamps: true,
    createdAt: 'created_at', // Maps to your schema fields
    updatedAt: false, 



});

module.exports = TrafficLog;
