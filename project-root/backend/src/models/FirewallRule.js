const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Endpoint = require('./Endpoint');

const FirewallRule = sequelize.define('FirewallRule', {
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
    type: {
        type: DataTypes.ENUM('block', 'allow'),
        allowNull: false,
    },
    domain: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ip_address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    protocol: {
        type: DataTypes.ENUM('TCP', 'UDP', 'ICMP'),
        allowNull: false,
    },
}, {
    tableName: 'firewall_rules',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = FirewallRule;
