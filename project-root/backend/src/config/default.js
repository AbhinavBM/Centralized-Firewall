module.exports = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'your_secret_key',
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'Abhi@1234',
        database: process.env.DB_NAME || 'postgres',
        dialect: 'postgres', // Update as per your database (e.g., 'mysql', 'postgres')
    },
    logging: process.env.LOG_LEVEL || 'info',
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'us-east-1',
        bucketName: process.env.AWS_BUCKET_NAME || 'your-bucket-name',
    },
    websocket: {
        port: process.env.WS_PORT || 8080,
    }
};
