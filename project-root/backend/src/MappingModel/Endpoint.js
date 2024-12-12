module.exports = (sequelize, DataTypes) => {
    const Endpoint = sequelize.define('Endpoint', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      hostname: DataTypes.STRING,
    });
  
    // Add associations
    Endpoint.hasMany(require('./EndpointApplicationMapping'), { foreignKey: 'endpoint_id' });
  
    return Endpoint;
  };
  