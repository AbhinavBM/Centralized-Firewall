import requests
import json
import os
from config import Config
from utils.logger import get_logger

logger = get_logger()

class AuthService:
    """
    Service for handling authentication with the central server.
    """
    def __init__(self):
        self.base_url = Config.API_BASE_URL
        self.token = Config.AUTH_TOKEN
        self.endpoint_id = Config.ENDPOINT_ID

    def register_endpoint(self):
        """
        Register the endpoint with the central server.
        """
        try:
            # First, try to authenticate to get a token
            if not self.token:
                self._authenticate()

            url = f"{self.base_url}/endpoints"
            logger.info(f"Attempting to register endpoint with server at: {url}")

            payload = {
                "hostname": Config.ENDPOINT_HOSTNAME,
                "os": Config.ENDPOINT_OS,
                "ipAddress": Config.ENDPOINT_IP,
                "status": "online",
                "password": Config.ENDPOINT_PASSWORD
            }

            logger.info(f"Registration payload: {payload}")

            headers = {
                "Content-Type": "application/json"
            }

            # Add token if available
            if self.token:
                headers["Authorization"] = f"Bearer {self.token}"
                logger.info("Using auth token for registration")

            logger.info("Sending registration request...")
            response = requests.post(url, json=payload, headers=headers, timeout=10)

            if response.status_code == 201:
                data = response.json()
                self.endpoint_id = data.get('data', {}).get('_id')

                # If _id is not found, try other possible formats
                if not self.endpoint_id:
                    self.endpoint_id = data.get('data', {}).get('id')

                if not self.endpoint_id and isinstance(data.get('data'), dict):
                    # Try to find any field that might be an ID
                    for key, value in data.get('data', {}).items():
                        if key.lower().endswith('id'):
                            self.endpoint_id = value
                            break

                # Save endpoint ID to .env file
                if self.endpoint_id:
                    self._update_env_file('ENDPOINT_ID', self.endpoint_id)
                    logger.info(f"Endpoint registered successfully with ID: {self.endpoint_id}")
                    return True, self.endpoint_id
                else:
                    logger.error("Endpoint ID not found in response")
                    logger.error(f"Response data: {data}")
                    return False, None
            else:
                logger.error(f"Failed to register endpoint: Status code {response.status_code}")
                logger.error(f"Response: {response.text}")
                return False, None

        except requests.exceptions.ConnectionError as e:
            logger.error(f"Connection error when registering endpoint: {str(e)}")
            logger.info("Continuing with dummy data since server connection failed")
            return False, None
        except requests.exceptions.Timeout as e:
            logger.error(f"Timeout when registering endpoint: {str(e)}")
            logger.info("Continuing with dummy data since server connection timed out")
            return False, None
        except Exception as e:
            logger.error(f"Error registering endpoint: {str(e)}")
            logger.info("Continuing with dummy data due to error")
            return False, None

    def _authenticate(self):
        """
        Authenticate with the central server to get a token.
        """
        try:
            url = f"{self.base_url}/auth/login"

            # Use default admin credentials
            payload = {
                "username": "admin",
                "password": "admin123"
            }

            headers = {
                "Content-Type": "application/json"
            }

            response = requests.post(url, json=payload, headers=headers, timeout=10)

            if response.status_code == 200:
                data = response.json()
                self.token = data.get('token')
                if self.token:
                    # Save token to .env file
                    self._update_env_file('AUTH_TOKEN', self.token)
                    logger.info("Successfully authenticated with server")
                    return True
                else:
                    logger.error("Token not found in authentication response")
                    return False
            else:
                logger.error(f"Failed to authenticate: Status code {response.status_code}")
                logger.error(f"Response: {response.text}")
                return False
        except Exception as e:
            logger.error(f"Error authenticating: {str(e)}")
            return False

    def update_endpoint_status(self, status):
        """
        Update the endpoint status on the central server.
        """
        if not self.endpoint_id:
            logger.error("Endpoint ID not available. Cannot update status.")
            return False

        try:
            # Ensure we have a token
            if not self.token and not self._authenticate():
                logger.warning("Proceeding without authentication token")

            url = f"{self.base_url}/endpoints/{self.endpoint_id}/status"

            payload = {
                "status": status
            }

            headers = {
                "Content-Type": "application/json"
            }

            # Add token if available
            if self.token:
                headers["Authorization"] = f"Bearer {self.token}"

            response = requests.patch(url, json=payload, headers=headers, timeout=10)

            if response.status_code == 200:
                logger.info(f"Endpoint status updated to: {status}")
                return True
            else:
                logger.error(f"Failed to update endpoint status: Status code {response.status_code}")
                logger.error(f"Response: {response.text}")
                return False

        except Exception as e:
            logger.error(f"Error updating endpoint status: {str(e)}")
            return False

    def send_heartbeat(self):
        """
        Send a heartbeat to the central server.
        """
        return self.update_endpoint_status("online")

    def _update_env_file(self, key, value):
        """
        Update a value in the .env file.
        """
        try:
            env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')

            if os.path.exists(env_path):
                # Read current .env file
                with open(env_path, 'r') as file:
                    lines = file.readlines()

                # Update or add the key-value pair
                key_found = False
                for i, line in enumerate(lines):
                    if line.startswith(f"{key}="):
                        lines[i] = f"{key}={value}\n"
                        key_found = True
                        break

                if not key_found:
                    lines.append(f"{key}={value}\n")

                # Write back to .env file
                with open(env_path, 'w') as file:
                    file.writelines(lines)

                logger.info(f"Updated {key} in .env file")
            else:
                logger.warning(".env file not found")

        except Exception as e:
            logger.error(f"Error updating .env file: {str(e)}")

# Create a singleton instance
auth_service = AuthService()
