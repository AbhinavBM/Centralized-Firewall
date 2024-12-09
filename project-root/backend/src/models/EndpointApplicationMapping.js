const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Endpoint = require('./Endpoint');
const Application = require('./Application');

// Define the EndpointApplicationMapping model
const EndpointApplicationMapping = sequelize.define('EndpointApplicationMapping', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  endpoint_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  application_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  applied_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Active',
  },
}, {
  tableName: 'endpoint_application_mapping',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Define associations
EndpointApplicationMapping.associate = () => {
  // EndpointApplicationMapping belongs to Endpoint model
  EndpointApplicationMapping.belongsTo(Endpoint, {
    foreignKey: 'endpoint_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // EndpointApplicationMapping belongs to Application model
  EndpointApplicationMapping.belongsTo(Application, {
    foreignKey: 'application_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

// Sync models and establish relationships
// Ensure that the models are associated properly after defining them
EndpointApplicationMapping.associate();

module.exports = EndpointApplicationMapping;
