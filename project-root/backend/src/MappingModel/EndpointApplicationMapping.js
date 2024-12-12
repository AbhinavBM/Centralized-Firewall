module.exports = (sequelize, DataTypes) => {
    const EndpointApplicationMapping = sequelize.define('EndpointApplicationMapping', {
      endpoint_id: DataTypes.INTEGER,
      application_id: DataTypes.INTEGER,
      status: DataTypes.STRING,
    });
  
    // Add associations
    EndpointApplicationMapping.belongsTo(require('./Endpoint'), { foreignKey: 'endpoint_id' });
    EndpointApplicationMapping.belongsTo(require('./Application'), { foreignKey: 'application_id' });
  
    return EndpointApplicationMapping;
  };
  