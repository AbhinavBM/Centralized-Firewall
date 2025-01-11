const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid'); // Import UUID v4

const Endpoint = sequelize.define(
    'Endpoint',
    {
        hostname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        os: {
            type: DataTypes.STRING,
        },
        ip_address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
        },
    },
    {
        tableName: 'endpoints',
        timestamps: true, // Use createdAt and updatedAt
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        defaultScope: {
            // Automatically use UUIDs for the primary key
            id: {
                type: DataTypes.UUID,
                defaultValue: uuidv4, // Automatically generate UUIDs
                primaryKey: true,
            }
        }
    }
);

module.exports = Endpoint;
