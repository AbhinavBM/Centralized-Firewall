import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # Flask configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    DEBUG = os.getenv('DEBUG', 'True').lower() in ('true', '1', 't')

    # Endpoint information
    ENDPOINT_ID = os.getenv('ENDPOINT_ID', '')
    ENDPOINT_HOSTNAME = os.getenv('ENDPOINT_HOSTNAME', 'test-endpoint')
    ENDPOINT_IP = os.getenv('ENDPOINT_IP', '192.168.1.100')
    ENDPOINT_OS = os.getenv('ENDPOINT_OS', 'Linux')
    ENDPOINT_PASSWORD = os.getenv('ENDPOINT_PASSWORD', 'test-password')

    # Central server configuration
    SERVER_URL = os.getenv('SERVER_URL', 'http://localhost:3000')
    API_BASE_URL = f"{SERVER_URL}/api"
    WS_URL = os.getenv('WS_URL', 'ws://localhost:3000')

    # Authentication
    AUTH_TOKEN = os.getenv('AUTH_TOKEN', '')

    # Local database (for storing rules, logs, etc.)
    LOCAL_DB_PATH = os.getenv('LOCAL_DB_PATH', 'endpoint_data.db')

    # MongoDB connection (same as backend)
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb+srv://roadsidecoder:yCeoaaLmLmYgxpK1@cluster0.yhpeljt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

    # Logging
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FILE = os.getenv('LOG_FILE', 'endpoint.log')

    # Intervals (in seconds)
    HEARTBEAT_INTERVAL = int(os.getenv('HEARTBEAT_INTERVAL', '60'))
    RULE_SYNC_INTERVAL = int(os.getenv('RULE_SYNC_INTERVAL', '300'))
    TRAFFIC_SCAN_INTERVAL = int(os.getenv('TRAFFIC_SCAN_INTERVAL', '30'))
    ANOMALY_CHECK_INTERVAL = int(os.getenv('ANOMALY_CHECK_INTERVAL', '120'))

    # Anomaly detection thresholds
    TRAFFIC_ANOMALY_THRESHOLD = int(os.getenv('TRAFFIC_ANOMALY_THRESHOLD', '1000'))
    CONNECTION_ANOMALY_THRESHOLD = int(os.getenv('CONNECTION_ANOMALY_THRESHOLD', '50'))
