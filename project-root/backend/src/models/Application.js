const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Endpoint = require('./Endpoint');

const Application = sequelize.define('Application', {
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
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('allowed', 'blocked', 'pending', 'suspended'),
        defaultValue: 'allowed',
        allowNull: false,
    },
}, {
    tableName: 'applications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

// Associations
Application.belongsTo(Endpoint, { foreignKey: 'endpoint_id' });
Endpoint.hasMany(Application, { foreignKey: 'endpoint_id' });

module.exports = Application;
