const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

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
    }
);

module.exports = Endpoint;
