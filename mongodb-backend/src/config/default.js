// Default configuration settings
module.exports = {
  // Server settings
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },
  
  // MongoDB settings
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/centralized-firewall',
  },
  
  // JWT settings
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRY || '24h',
  },
  
  // Logging settings
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/server.log',
  },
  
  // CORS settings
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
  
  // Endpoint agent settings
  endpointAgent: {
    heartbeatInterval: process.env.AGENT_HEARTBEAT_INTERVAL || 60000, // 1 minute
    connectionTimeout: process.env.AGENT_CONNECTION_TIMEOUT || 300000, // 5 minutes
  },
};
