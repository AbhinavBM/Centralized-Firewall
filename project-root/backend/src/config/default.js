module.exports = {
    PORT: process.env.PORT || 3000,
    DB_CONFIG: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'firewall_db',
        dialect: 'postgres',
    },
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    WEBSOCKET_PORT: process.env.WS_PORT || 8080,
};
