# Endpoint Client for Centralized Firewall Management

This is a Python Flask-based endpoint client for the Centralized Firewall Management system. It provides a simulated endpoint that can communicate with the central MongoDB backend server.

## Features

- Authentication with the central server
- Fetching and storing firewall rules locally
- Simulated traffic monitoring
- Dummy anomaly detection
- Sending logs to the central server
- WebSocket communication for real-time updates
- Web interface for testing and demonstration

## Requirements

- Python 3.7+
- Flask
- Requests
- WebSocket client
- Other dependencies listed in `requirements.txt`

## Installation

1. Clone the repository
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Configure the `.env` file with your settings (see Configuration section)
4. Run the application:

```bash
python app.py
```

## Configuration

The application can be configured using the `.env` file. Here are the available options:

```
# Flask configuration
SECRET_KEY=endpoint-secret-key
DEBUG=True

# Endpoint information
ENDPOINT_ID=
ENDPOINT_HOSTNAME=test-endpoint
ENDPOINT_IP=192.168.1.100
ENDPOINT_OS=Linux
ENDPOINT_PASSWORD=test-password

# Central server configuration
SERVER_URL=http://localhost:3000
WS_URL=ws://localhost:3000

# Authentication
AUTH_TOKEN=

# Local database
LOCAL_DB_PATH=endpoint_data.db

# Logging
LOG_LEVEL=INFO
LOG_FILE=endpoint.log

# Intervals (in seconds)
HEARTBEAT_INTERVAL=60
RULE_SYNC_INTERVAL=300
TRAFFIC_SCAN_INTERVAL=30
ANOMALY_CHECK_INTERVAL=120

# Anomaly detection thresholds
TRAFFIC_ANOMALY_THRESHOLD=1000
CONNECTION_ANOMALY_THRESHOLD=50
```

## Usage

### Web Interface

The endpoint client provides a web interface for testing and demonstration. You can access it at `http://localhost:5000`.

The web interface allows you to:

- Register the endpoint with the central server
- Sync firewall rules from the central server
- Apply firewall rules
- Monitor traffic
- Generate dummy firewall rules and anomalies
- Connect and disconnect from the WebSocket server
- View firewall rules, traffic logs, and anomalies

### API Endpoints

The endpoint client provides the following API endpoints:

- `GET /api/status` - Get the endpoint status
- `POST /api/register` - Register the endpoint with the central server
- `GET /api/rules` - Get all firewall rules
- `GET /api/rules/:id` - Get a firewall rule by ID
- `POST /api/rules/sync` - Sync firewall rules from the central server
- `POST /api/rules/apply` - Apply firewall rules
- `POST /api/rules/generate` - Generate dummy firewall rules
- `GET /api/traffic` - Get traffic logs
- `POST /api/traffic/monitor` - Monitor traffic
- `POST /api/traffic/clear` - Clear traffic logs
- `GET /api/anomalies` - Get anomalies
- `POST /api/anomalies/:id/resolve` - Resolve an anomaly
- `POST /api/anomalies/generate` - Generate dummy anomalies
- `POST /api/websocket/connect` - Connect to the WebSocket server
- `POST /api/websocket/disconnect` - Disconnect from the WebSocket server
- `GET /api/websocket/status` - Get WebSocket connection status

## Architecture

The endpoint client is built using a modular architecture:

- `app.py` - Main Flask application
- `config.py` - Configuration settings
- `models/` - Data models
  - `firewall_rule.py` - Firewall rule model
  - `traffic_log.py` - Traffic log model
  - `anomaly.py` - Anomaly model
- `services/` - Business logic
  - `auth_service.py` - Authentication with central server
  - `firewall_service.py` - Firewall rule management
  - `traffic_service.py` - Traffic monitoring
  - `anomaly_service.py` - Anomaly detection
  - `websocket_client.py` - WebSocket client for real-time updates
- `utils/` - Utility functions
  - `logger.py` - Logging utility
  - `helpers.py` - Helper functions
- `templates/` - HTML templates for the web interface
- `data/` - Local data storage (created at runtime)

## Background Tasks

The endpoint client runs several background tasks:

- Heartbeat - Sends a heartbeat to the central server every `HEARTBEAT_INTERVAL` seconds
- Rule Sync - Syncs firewall rules from the central server every `RULE_SYNC_INTERVAL` seconds
- Traffic Monitoring - Monitors traffic every `TRAFFIC_SCAN_INTERVAL` seconds
- WebSocket Ping - Sends a ping to the WebSocket server every 30 seconds

## Notes

This is a dummy implementation for testing purposes. In a real-world scenario:

- The firewall rule application would interact with the OS firewall
- Traffic monitoring would capture actual network traffic
- Anomaly detection would use more sophisticated algorithms
- Authentication would be more secure

## License

This project is licensed under the MIT License - see the LICENSE file for details.
