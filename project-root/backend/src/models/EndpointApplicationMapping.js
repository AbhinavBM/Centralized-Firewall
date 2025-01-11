const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Endpoint = require('./Endpoint');
const Application = require('./Application');

// Define the EndpointApplicationMapping model
const EndpointApplicationMapping = sequelize.define('EndpointApplicationMapping', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.fn('gen_random_uuid'), // Matches PostgreSQL's gen_random_uuid()
    allowNull: false,
  },
  endpoint_id: {
    type: DataTypes.INTEGER, // Matches the PostgreSQL INTEGER type
    allowNull: false,
    references: {
      model: Endpoint,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  application_id: {
    type: DataTypes.UUID, // Matches the PostgreSQL UUID type
    allowNull: false,
    references: {
      model: Application,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  applied_at: {
    type: DataTypes.DATE, // Sequelize DATE includes support for timezone
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Matches PostgreSQL default
  },
}, {
  tableName: 'endpoint_application_mapping',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['endpoint_id', 'application_id'], // Matches the unique constraint
    },
  ],
});

// Define associations
EndpointApplicationMapping.associate = () => {
  EndpointApplicationMapping.belongsTo(Endpoint, {
    foreignKey: 'endpoint_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  EndpointApplicationMapping.belongsTo(Application, {
    foreignKey: 'application_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

module.exports = EndpointApplicationMapping;
