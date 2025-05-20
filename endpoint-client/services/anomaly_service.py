import requests
import json
import os
import time
import random
from config import Config
from utils.logger import get_logger
from utils.helpers import generate_anomaly_from_traffic, get_timestamp
from models.anomaly import Anomaly
from services.auth_service import auth_service

logger = get_logger()

class AnomalyService:
    """
    Service for detecting and managing anomalies.
    """
    def __init__(self):
        self.base_url = Config.API_BASE_URL
        self.token = Config.AUTH_TOKEN
        self.endpoint_id = Config.ENDPOINT_ID
        self.anomalies = []
        self.anomalies_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'anomalies.json')
        
        # Create data directory if it doesn't exist
        os.makedirs(os.path.dirname(self.anomalies_file), exist_ok=True)
        
        # Load existing anomalies
        self.load_anomalies()
    
    def detect_anomalies(self, traffic_logs):
        """
        Detect anomalies in traffic logs.
        """
        try:
            detected_anomalies = []
            
            for log in traffic_logs:
                # In a real system, this would use more sophisticated anomaly detection
                # For this dummy implementation, we'll use a simple threshold
                if log.dataTransferred > Config.TRAFFIC_ANOMALY_THRESHOLD:
                    # Generate anomaly from traffic log
                    anomaly_data = generate_anomaly_from_traffic(log.to_dict())
                    
                    # Add endpoint ID
                    anomaly_data['endpointId'] = self.endpoint_id
                    
                    # Create Anomaly object
                    anomaly = Anomaly.from_dict(anomaly_data)
                    
                    # Add to anomalies
                    self.anomalies.append(anomaly)
                    detected_anomalies.append(anomaly)
            
            # Save anomalies to file
            self.save_anomalies()
            
            # Send anomalies to central server
            if detected_anomalies:
                self.send_anomalies(detected_anomalies)
            
            logger.info(f"Detected {len(detected_anomalies)} anomalies")
            
            return detected_anomalies
        
        except Exception as e:
            logger.error(f"Error detecting anomalies: {str(e)}")
            return []
    
    def get_anomalies(self, limit=100, include_resolved=False):
        """
        Get anomalies.
        """
        if include_resolved:
            filtered_anomalies = self.anomalies
        else:
            filtered_anomalies = [a for a in self.anomalies if not a.resolved]
        
        return filtered_anomalies[-limit:] if limit else filtered_anomalies
    
    def resolve_anomaly(self, anomaly_id, resolved_by=None):
        """
        Resolve an anomaly.
        """
        try:
            for anomaly in self.anomalies:
                if anomaly.id == anomaly_id:
                    anomaly.resolved = True
                    anomaly.resolvedBy = resolved_by
                    anomaly.resolvedAt = get_timestamp()
                    
                    # Save anomalies to file
                    self.save_anomalies()
                    
                    # Update on central server
                    self.update_anomaly(anomaly)
                    
                    logger.info(f"Resolved anomaly: {anomaly_id}")
                    return True
            
            logger.warning(f"Anomaly not found: {anomaly_id}")
            return False
        
        except Exception as e:
            logger.error(f"Error resolving anomaly: {str(e)}")
            return False
    
    def send_anomalies(self, anomalies):
        """
        Send anomalies to the central server.
        """
        try:
            url = f"{self.base_url}/anomalies"
            
            headers = {
                "Content-Type": "application/json"
            }
            
            # Add token if available
            if self.token:
                headers["Authorization"] = f"Bearer {self.token}"
            
            # Send each anomaly individually
            for anomaly in anomalies:
                payload = anomaly.to_dict()
                
                # Ensure endpointId is set
                if not payload.get('endpointId'):
                    payload['endpointId'] = self.endpoint_id
                
                response = requests.post(url, json=payload, headers=headers)
                
                if response.status_code == 201:
                    # Update anomaly ID from response
                    data = response.json()
                    if 'data' in data and 'id' in data['data']:
                        anomaly.id = data['data']['id']
                else:
                    logger.error(f"Failed to send anomaly: {response.text}")
            
            # Save updated anomalies to file
            self.save_anomalies()
            
            logger.info(f"Sent {len(anomalies)} anomalies to central server")
            return True
        
        except Exception as e:
            logger.error(f"Error sending anomalies: {str(e)}")
            return False
    
    def update_anomaly(self, anomaly):
        """
        Update an anomaly on the central server.
        """
        try:
            if not anomaly.id:
                logger.error("Anomaly ID not available. Cannot update.")
                return False
            
            url = f"{self.base_url}/anomalies/{anomaly.id}/resolve"
            
            headers = {
                "Content-Type": "application/json"
            }
            
            # Add token if available
            if self.token:
                headers["Authorization"] = f"Bearer {self.token}"
            
            response = requests.patch(url, headers=headers)
            
            if response.status_code == 200:
                logger.info(f"Updated anomaly on central server: {anomaly.id}")
                return True
            else:
                logger.error(f"Failed to update anomaly: {response.text}")
                return False
        
        except Exception as e:
            logger.error(f"Error updating anomaly: {str(e)}")
            return False
    
    def load_anomalies(self):
        """
        Load anomalies from file.
        """
        try:
            if os.path.exists(self.anomalies_file):
                with open(self.anomalies_file, 'r') as file:
                    anomalies_data = json.load(file)
                
                self.anomalies = [Anomaly.from_dict(anomaly) for anomaly in anomalies_data]
                logger.info(f"Loaded {len(self.anomalies)} anomalies from file")
            else:
                logger.info("No anomalies file found")
        
        except Exception as e:
            logger.error(f"Error loading anomalies: {str(e)}")
    
    def save_anomalies(self):
        """
        Save anomalies to file.
        """
        try:
            # Keep only the last 1000 anomalies to prevent the file from growing too large
            anomalies_to_save = self.anomalies[-1000:] if len(self.anomalies) > 1000 else self.anomalies
            
            anomalies_data = [anomaly.to_dict() for anomaly in anomalies_to_save]
            
            with open(self.anomalies_file, 'w') as file:
                json.dump(anomalies_data, file, indent=2)
            
            logger.info(f"Saved {len(anomalies_to_save)} anomalies to file")
        
        except Exception as e:
            logger.error(f"Error saving anomalies: {str(e)}")
    
    def generate_dummy_anomalies(self, count=5):
        """
        Generate dummy anomalies for testing.
        """
        from utils.helpers import generate_random_traffic_log
        
        dummy_anomalies = []
        
        for _ in range(count):
            # Generate random traffic log
            traffic_data = generate_random_traffic_log()
            
            # Force high data transfer to trigger anomaly
            traffic_data['dataTransferred'] = random.randint(Config.TRAFFIC_ANOMALY_THRESHOLD + 1, Config.TRAFFIC_ANOMALY_THRESHOLD * 2)
            
            # Generate anomaly from traffic log
            anomaly_data = generate_anomaly_from_traffic(traffic_data)
            
            # Add endpoint ID
            anomaly_data['endpointId'] = self.endpoint_id
            
            # Create Anomaly object
            anomaly = Anomaly.from_dict(anomaly_data)
            
            # Add to anomalies
            self.anomalies.append(anomaly)
            dummy_anomalies.append(anomaly)
        
        # Save anomalies to file
        self.save_anomalies()
        
        logger.info(f"Generated {count} dummy anomalies")
        return dummy_anomalies

# Create a singleton instance
anomaly_service = AnomalyService()
