import requests
import json
import os
import time
from config import Config
from utils.logger import get_logger
from models.firewall_rule import FirewallRule

logger = get_logger()

class FirewallService:
    """
    Service for managing firewall rules.
    """
    def __init__(self):
        self.base_url = Config.API_BASE_URL
        self.token = Config.AUTH_TOKEN
        self.endpoint_id = Config.ENDPOINT_ID
        self.rules = []
        self.rules_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'firewall_rules.json')
        
        # Create data directory if it doesn't exist
        os.makedirs(os.path.dirname(self.rules_file), exist_ok=True)
        
        # Load existing rules
        self.load_rules()
    
    def sync_rules(self):
        """
        Sync firewall rules from the central server.
        """
        try:
            # Get mappings for this endpoint
            mappings = self._get_endpoint_mappings()
            
            if not mappings:
                logger.warning("No application mappings found for this endpoint")
                return False
            
            # Get rules for each application
            all_rules = []
            for mapping in mappings:
                app_id = mapping.get('applicationId')
                if app_id:
                    app_rules = self._get_application_rules(app_id)
                    all_rules.extend(app_rules)
            
            # Update local rules
            self.rules = [FirewallRule.from_dict(rule) for rule in all_rules]
            
            # Save rules to file
            self.save_rules()
            
            logger.info(f"Synced {len(self.rules)} firewall rules from central server")
            return True
        
        except Exception as e:
            logger.error(f"Error syncing firewall rules: {str(e)}")
            return False
    
    def get_rules(self):
        """
        Get all firewall rules.
        """
        return self.rules
    
    def get_rule_by_id(self, rule_id):
        """
        Get a firewall rule by ID.
        """
        for rule in self.rules:
            if rule.id == rule_id:
                return rule
        return None
    
    def apply_rules(self):
        """
        Apply firewall rules to the system.
        This is a dummy implementation that just logs the rules.
        In a real system, this would interact with the OS firewall.
        """
        try:
            enabled_rules = [rule for rule in self.rules if rule.enabled]
            
            logger.info(f"Applying {len(enabled_rules)} firewall rules")
            
            for rule in enabled_rules:
                logger.info(f"Applied rule: {rule.name} - {rule.action} - {rule.protocol} - {rule.sourceIp}:{rule.sourcePort} -> {rule.destinationIp}:{rule.destinationPort}")
            
            return True
        
        except Exception as e:
            logger.error(f"Error applying firewall rules: {str(e)}")
            return False
    
    def load_rules(self):
        """
        Load firewall rules from file.
        """
        try:
            if os.path.exists(self.rules_file):
                with open(self.rules_file, 'r') as file:
                    rules_data = json.load(file)
                
                self.rules = [FirewallRule.from_dict(rule) for rule in rules_data]
                logger.info(f"Loaded {len(self.rules)} firewall rules from file")
            else:
                logger.info("No firewall rules file found")
        
        except Exception as e:
            logger.error(f"Error loading firewall rules: {str(e)}")
    
    def save_rules(self):
        """
        Save firewall rules to file.
        """
        try:
            rules_data = [rule.to_dict() for rule in self.rules]
            
            with open(self.rules_file, 'w') as file:
                json.dump(rules_data, file, indent=2)
            
            logger.info(f"Saved {len(self.rules)} firewall rules to file")
        
        except Exception as e:
            logger.error(f"Error saving firewall rules: {str(e)}")
    
    def _get_endpoint_mappings(self):
        """
        Get application mappings for this endpoint from the central server.
        """
        try:
            url = f"{self.base_url}/mapping/endpoint/{self.endpoint_id}"
            
            headers = {
                "Content-Type": "application/json"
            }
            
            # Add token if available
            if self.token:
                headers["Authorization"] = f"Bearer {self.token}"
            
            response = requests.get(url, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                return data.get('data', [])
            else:
                logger.error(f"Failed to get endpoint mappings: {response.text}")
                return []
        
        except Exception as e:
            logger.error(f"Error getting endpoint mappings: {str(e)}")
            return []
    
    def _get_application_rules(self, app_id):
        """
        Get firewall rules for an application from the central server.
        """
        try:
            url = f"{self.base_url}/firewall/rules/application/{app_id}"
            
            headers = {
                "Content-Type": "application/json"
            }
            
            # Add token if available
            if self.token:
                headers["Authorization"] = f"Bearer {self.token}"
            
            response = requests.get(url, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                return data.get('data', [])
            else:
                logger.error(f"Failed to get application rules: {response.text}")
                return []
        
        except Exception as e:
            logger.error(f"Error getting application rules: {str(e)}")
            return []
    
    def generate_dummy_rules(self, count=10):
        """
        Generate dummy firewall rules for testing.
        """
        from utils.helpers import (
            generate_random_id, get_timestamp, generate_random_ip,
            generate_random_port, generate_random_protocol
        )
        
        dummy_rules = []
        
        for i in range(count):
            rule_id = generate_random_id()
            protocol = generate_random_protocol()
            action = "ALLOW" if i % 3 != 0 else "DENY"
            
            rule = FirewallRule(
                rule_id=rule_id,
                name=f"Dummy Rule {i+1}",
                description=f"This is a dummy rule for testing purposes",
                source_ip=generate_random_ip(),
                destination_ip=generate_random_ip(),
                source_port=generate_random_port(),
                destination_port=generate_random_port(),
                protocol=protocol,
                action=action,
                priority=i,
                enabled=True,
                application_id="dummy-app-id",
                created_at=get_timestamp(),
                updated_at=get_timestamp()
            )
            
            dummy_rules.append(rule)
        
        self.rules = dummy_rules
        self.save_rules()
        
        logger.info(f"Generated {count} dummy firewall rules")
        return dummy_rules

# Create a singleton instance
firewall_service = FirewallService()
