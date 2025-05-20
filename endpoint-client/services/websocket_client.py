import websocket
import json
import threading
import time
import ssl
from config import Config
from utils.logger import get_logger
from services.auth_service import auth_service
from services.firewall_service import firewall_service

logger = get_logger()

class WebSocketClient:
    """
    WebSocket client for real-time communication with the central server.
    """
    def __init__(self):
        self.ws_url = Config.WS_URL
        self.token = Config.AUTH_TOKEN
        self.endpoint_id = Config.ENDPOINT_ID
        self.ws = None
        self.connected = False
        self.reconnect_delay = 5  # seconds
        self.max_reconnect_delay = 60  # seconds
        self.thread = None
        self.running = False

    def start(self):
        """
        Start the WebSocket client in a separate thread.
        """
        if self.thread and self.thread.is_alive():
            logger.warning("WebSocket client already running")
            return

        self.running = True
        self.thread = threading.Thread(target=self._run)
        self.thread.daemon = True
        self.thread.start()

        logger.info("WebSocket client started")

    def stop(self):
        """
        Stop the WebSocket client.
        """
        self.running = False

        if self.ws:
            self.ws.close()

        if self.thread and self.thread.is_alive():
            self.thread.join(timeout=1)

        logger.info("WebSocket client stopped")

    def _run(self):
        """
        Run the WebSocket client.
        """
        while self.running:
            try:
                # Check if we have a token, if not, try to get one from auth_service
                if not self.token:
                    from services.auth_service import auth_service
                    auth_service._authenticate()
                    self.token = auth_service.token

                # Create WebSocket connection
                ws_url_with_token = f"{self.ws_url}?token={self.token}"
                logger.info(f"Connecting to WebSocket server at: {self.ws_url}")

                # Set up WebSocket with callbacks
                self.ws = websocket.WebSocketApp(
                    ws_url_with_token,
                    on_open=self._on_open,
                    on_message=self._on_message,
                    on_error=self._on_error,
                    on_close=self._on_close
                )

                # Connect to WebSocket server with ping interval
                self.ws.run_forever(
                    sslopt={"cert_reqs": ssl.CERT_NONE},
                    ping_interval=30,  # Send a ping every 30 seconds
                    ping_timeout=10     # Wait 10 seconds for pong response
                )

                # If we get here, the connection was closed
                if self.running:
                    logger.info(f"WebSocket connection closed, reconnecting in {self.reconnect_delay} seconds...")
                    # Wait before reconnecting
                    time.sleep(self.reconnect_delay)

                    # Increase reconnect delay (with a maximum)
                    self.reconnect_delay = min(self.reconnect_delay * 1.5, self.max_reconnect_delay)

            except websocket.WebSocketException as e:
                logger.error(f"WebSocket protocol error: {str(e)}")
                time.sleep(self.reconnect_delay)
                self.reconnect_delay = min(self.reconnect_delay * 1.5, self.max_reconnect_delay)

            except ConnectionRefusedError as e:
                logger.error(f"Connection refused: {str(e)}")
                logger.info(f"Server might not be running, retrying in {self.reconnect_delay} seconds...")
                time.sleep(self.reconnect_delay)
                self.reconnect_delay = min(self.reconnect_delay * 1.5, self.max_reconnect_delay)

            except Exception as e:
                logger.error(f"WebSocket error: {str(e)}")

                # Wait before reconnecting
                time.sleep(self.reconnect_delay)

                # Increase reconnect delay (with a maximum)
                self.reconnect_delay = min(self.reconnect_delay * 1.5, self.max_reconnect_delay)

    def _on_open(self, ws):
        """
        Called when the WebSocket connection is opened.
        """
        self.connected = True
        self.reconnect_delay = 5  # Reset reconnect delay

        logger.info("WebSocket connection opened")

        # Subscribe to endpoint-specific events
        if self.endpoint_id:
            self._subscribe_to_endpoint(self.endpoint_id)

    def _on_message(self, ws, message):
        """
        Called when a message is received from the WebSocket server.
        """
        try:
            data = json.loads(message)

            message_type = data.get('type')

            if message_type == 'connection':
                logger.info(f"WebSocket connection message: {data.get('message')}")

            elif message_type == 'firewallRule':
                self._handle_firewall_rule_message(data)

            elif message_type == 'systemStatus':
                logger.info(f"System status update: {data.get('data')}")

            elif message_type == 'pong':
                logger.debug("Received pong response")

            else:
                logger.info(f"Received WebSocket message: {message}")

        except json.JSONDecodeError:
            logger.error(f"Invalid JSON in WebSocket message: {message}")

        except Exception as e:
            logger.error(f"Error handling WebSocket message: {str(e)}")

    def _on_error(self, ws, error):
        """
        Called when a WebSocket error occurs.
        """
        self.connected = False
        logger.error(f"WebSocket error: {str(error)}")

    def _on_close(self, ws, close_status_code, close_msg):
        """
        Called when the WebSocket connection is closed.
        """
        self.connected = False
        logger.info(f"WebSocket connection closed: {close_status_code} - {close_msg}")

    def _subscribe_to_endpoint(self, endpoint_id):
        """
        Subscribe to endpoint-specific events.
        """
        try:
            message = {
                'type': 'subscribe',
                'target': 'endpoint',
                'id': endpoint_id
            }

            self.ws.send(json.dumps(message))
            logger.info(f"Subscribed to endpoint events: {endpoint_id}")

        except Exception as e:
            logger.error(f"Error subscribing to endpoint events: {str(e)}")

    def _handle_firewall_rule_message(self, data):
        """
        Handle firewall rule messages.
        """
        action = data.get('action')
        rule_data = data.get('data')

        if action == 'created':
            logger.info(f"New firewall rule created: {rule_data.get('name')}")
            # Sync rules from server
            firewall_service.sync_rules()

        elif action == 'updated':
            logger.info(f"Firewall rule updated: {rule_data.get('name')}")
            # Sync rules from server
            firewall_service.sync_rules()

        elif action == 'deleted':
            logger.info(f"Firewall rule deleted: {rule_data.get('id')}")
            # Sync rules from server
            firewall_service.sync_rules()

        elif action == 'batchCreated':
            count = rule_data.get('count', 0)
            logger.info(f"Batch created {count} firewall rules")
            # Sync rules from server
            firewall_service.sync_rules()

        elif action == 'batchDeleted':
            ids = rule_data.get('ids', [])
            logger.info(f"Batch deleted {len(ids)} firewall rules")
            # Sync rules from server
            firewall_service.sync_rules()

    def send_ping(self):
        """
        Send a ping message to the WebSocket server.
        """
        if not self.connected or not self.ws:
            logger.warning("Cannot send ping: WebSocket not connected")
            return

        try:
            message = {
                'type': 'ping',
                'timestamp': time.time()
            }

            self.ws.send(json.dumps(message))
            logger.debug("Sent ping message")

        except Exception as e:
            logger.error(f"Error sending ping: {str(e)}")

    def request_system_status(self):
        """
        Request system status from the WebSocket server.
        """
        if not self.connected or not self.ws:
            logger.warning("Cannot request system status: WebSocket not connected")
            return

        try:
            message = {
                'type': 'getStatus',
                'target': 'system'
            }

            self.ws.send(json.dumps(message))
            logger.info("Requested system status")

        except Exception as e:
            logger.error(f"Error requesting system status: {str(e)}")

# Create a singleton instance
websocket_client = WebSocketClient()
