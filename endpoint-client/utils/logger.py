import logging
import os
from logging.handlers import RotatingFileHandler
from config import Config

# Create logs directory if it doesn't exist
os.makedirs('logs', exist_ok=True)

# Configure logger
logger = logging.getLogger('endpoint_client')
logger.setLevel(getattr(logging, Config.LOG_LEVEL))

# Create console handler
console_handler = logging.StreamHandler()
console_handler.setLevel(getattr(logging, Config.LOG_LEVEL))

# Create file handler
file_handler = RotatingFileHandler(
    os.path.join('logs', Config.LOG_FILE),
    maxBytes=10485760,  # 10MB
    backupCount=5
)
file_handler.setLevel(getattr(logging, Config.LOG_LEVEL))

# Create formatter
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)
file_handler.setFormatter(formatter)

# Add handlers to logger
logger.addHandler(console_handler)
logger.addHandler(file_handler)

def get_logger():
    return logger
