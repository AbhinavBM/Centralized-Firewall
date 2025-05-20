import requests
import json
import os
import time
import random
from config import Config
from utils.logger import get_logger
from utils.helpers import generate_random_traffic_log, is_anomaly
from models.traffic_log import TrafficLog
from services.auth_service import auth_service

logger = get_logger()

class TrafficService:
    """
    Service for monitoring and logging network traffic.
    """
    def __init__(self):
        self.base_url = Config.API_BASE_URL
        self.token = Config.AUTH_TOKEN
        self.endpoint_id = Config.ENDPOINT_ID
        self.logs = []
        self.logs_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'traffic_logs.json')
        
        # Create data directory if it doesn't exist
        os.makedirs(os.path.dirname(self.logs_file), exist_ok=True)
        
        # Load existing logs
        self.load_logs()
    
    def monitor_traffic(self):
        """
        Monitor network traffic.
        This is a dummy implementation that generates random traffic logs.
        In a real system, this would capture actual network traffic.
        """
        try:
            # Generate random number of traffic logs (1-5)
            num_logs = random.randint(1, 5)
            
            new_logs = []
            anomalies = []
            
            for _ in range(num_logs):
                # Generate random traffic log
                traffic_data = generate_random_traffic_log()
                
                # Add endpoint ID
                traffic_data['endpointId'] = self.endpoint_id
                
                # Create TrafficLog object
                traffic_log = TrafficLog.from_dict(traffic_data)
                
                # Add to logs
                self.logs.append(traffic_log)
                new_logs.append(traffic_log)
                
                # Check for anomalies
                if is_anomaly(traffic_data, Config.TRAFFIC_ANOMALY_THRESHOLD):
                    anomalies.append(traffic_log)
            
            # Save logs to file
            self.save_logs()
            
            # Send logs to central server
            self.send_logs(new_logs)
            
            logger.info(f"Monitored traffic: {num_logs} new logs, {len(anomalies)} anomalies")
            
            return new_logs, anomalies
        
        except Exception as e:
            logger.error(f"Error monitoring traffic: {str(e)}")
            return [], []
    
    def get_logs(self, limit=100):
        """
        Get traffic logs.
        """
        return self.logs[-limit:] if limit else self.logs
    
    def send_logs(self, logs):
        """
        Send traffic logs to the central server.
        """
        try:
            url = f"{self.base_url}/logs/traffic"
            
            headers = {
                "Content-Type": "application/json"
            }
            
            # Add token if available
            if self.token:
                headers["Authorization"] = f"Bearer {self.token}"
            
            # Send each log individually
            for log in logs:
                payload = log.to_dict()
                
                # Ensure endpointId is set
                if not payload.get('endpointId'):
                    payload['endpointId'] = self.endpoint_id
                
                response = requests.post(url, json=payload, headers=headers)
                
                if response.status_code != 201:
                    logger.error(f"Failed to send traffic log: {response.text}")
            
            logger.info(f"Sent {len(logs)} traffic logs to central server")
            return True
        
        except Exception as e:
            logger.error(f"Error sending traffic logs: {str(e)}")
            return False
    
    def load_logs(self):
        """
        Load traffic logs from file.
        """
        try:
            if os.path.exists(self.logs_file):
                with open(self.logs_file, 'r') as file:
                    logs_data = json.load(file)
                
                self.logs = [TrafficLog.from_dict(log) for log in logs_data]
                logger.info(f"Loaded {len(self.logs)} traffic logs from file")
            else:
                logger.info("No traffic logs file found")
        
        except Exception as e:
            logger.error(f"Error loading traffic logs: {str(e)}")
    
    def save_logs(self):
        """
        Save traffic logs to file.
        """
        try:
            # Keep only the last 1000 logs to prevent the file from growing too large
            logs_to_save = self.logs[-1000:] if len(self.logs) > 1000 else self.logs
            
            logs_data = [log.to_dict() for log in logs_to_save]
            
            with open(self.logs_file, 'w') as file:
                json.dump(logs_data, file, indent=2)
            
            logger.info(f"Saved {len(logs_to_save)} traffic logs to file")
        
        except Exception as e:
            logger.error(f"Error saving traffic logs: {str(e)}")
    
    def clear_logs(self):
        """
        Clear all traffic logs.
        """
        self.logs = []
        self.save_logs()
        logger.info("Cleared all traffic logs")

# Create a singleton instance
traffic_service = TrafficService()
