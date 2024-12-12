module.exports = (sequelize, DataTypes) => {
    const Application = sequelize.define('Application', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
    });
  
    // Add associations
    Application.hasMany(require('./EndpointApplicationMapping'), { foreignKey: 'application_id' });
  
    return Application;
  };
  