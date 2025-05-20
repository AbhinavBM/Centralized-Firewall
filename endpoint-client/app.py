import os
import json
import threading
import time
import schedule
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from config import Config
from utils.logger import get_logger
from services.auth_service import auth_service
from services.firewall_service import firewall_service
from services.traffic_service import traffic_service
from services.anomaly_service import anomaly_service
from services.websocket_client import websocket_client
from services.mongodb_service import mongodb_service

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure app
app.config['SECRET_KEY'] = Config.SECRET_KEY
app.config['DEBUG'] = Config.DEBUG

# Get logger
logger = get_logger()

# Background tasks
def run_scheduled_tasks():
    """
    Run scheduled tasks in the background.
    """
    # Schedule tasks (only local ones)
    # schedule.every(Config.HEARTBEAT_INTERVAL).seconds.do(auth_service.send_heartbeat)
    # schedule.every(Config.RULE_SYNC_INTERVAL).seconds.do(firewall_service.sync_rules)
    schedule.every(Config.RULE_SYNC_INTERVAL + 5).seconds.do(firewall_service.apply_rules)
    schedule.every(Config.TRAFFIC_SCAN_INTERVAL).seconds.do(monitor_and_analyze_traffic)

    # WebSocket ping (disabled)
    # schedule.every(30).seconds.do(websocket_client.send_ping)

    # Run the scheduler
    while True:
        schedule.run_pending()
        time.sleep(1)

def monitor_and_analyze_traffic():
    """
    Monitor traffic and analyze for anomalies.
    """
    # Monitor traffic
    new_logs, potential_anomalies = traffic_service.monitor_traffic()

    # Detect anomalies
    if new_logs:
        anomaly_service.detect_anomalies(new_logs)

# Routes
@app.route('/')
def index():
    """
    Render the dashboard page.
    """
    return render_template('index.html')

@app.route('/api/status')
def status():
    """
    Get the endpoint status.
    """
    return jsonify({
        'status': 'online',
        'endpoint': {
            'id': Config.ENDPOINT_ID,
            'hostname': Config.ENDPOINT_HOSTNAME,
            'ip': Config.ENDPOINT_IP,
            'os': Config.ENDPOINT_OS
        },
        'rules': len(firewall_service.get_rules()),
        'logs': len(traffic_service.get_logs()),
        'anomalies': len(anomaly_service.get_anomalies())
    })

@app.route('/api/register', methods=['POST'])
def register():
    """
    Register the endpoint with the central server.
    """
    success, endpoint_id = auth_service.register_endpoint()

    if success:
        return jsonify({
            'success': True,
            'message': 'Endpoint registered successfully',
            'endpointId': endpoint_id
        })
    else:
        return jsonify({
            'success': False,
            'message': 'Failed to register endpoint'
        }), 500

@app.route('/api/rules')
def get_rules():
    """
    Get all firewall rules.
    """
    rules = firewall_service.get_rules()
    return jsonify({
        'success': True,
        'count': len(rules),
        'data': [rule.to_dict() for rule in rules]
    })

@app.route('/api/rules/<rule_id>')
def get_rule(rule_id):
    """
    Get a firewall rule by ID.
    """
    rule = firewall_service.get_rule_by_id(rule_id)

    if rule:
        return jsonify({
            'success': True,
            'data': rule.to_dict()
        })
    else:
        return jsonify({
            'success': False,
            'message': 'Rule not found'
        }), 404

@app.route('/api/rules/sync', methods=['POST'])
def sync_rules():
    """
    Sync firewall rules from the central server.
    """
    success = firewall_service.sync_rules()

    if success:
        return jsonify({
            'success': True,
            'message': 'Rules synced successfully',
            'count': len(firewall_service.get_rules())
        })
    else:
        return jsonify({
            'success': False,
            'message': 'Failed to sync rules'
        }), 500

@app.route('/api/rules/apply', methods=['POST'])
def apply_rules():
    """
    Apply firewall rules.
    """
    success = firewall_service.apply_rules()

    if success:
        return jsonify({
            'success': True,
            'message': 'Rules applied successfully'
        })
    else:
        return jsonify({
            'success': False,
            'message': 'Failed to apply rules'
        }), 500

@app.route('/api/rules/generate', methods=['POST'])
def generate_rules():
    """
    Generate dummy firewall rules.
    """
    count = request.json.get('count', 10)
    rules = firewall_service.generate_dummy_rules(count)

    return jsonify({
        'success': True,
        'message': f'Generated {len(rules)} dummy rules',
        'count': len(rules)
    })

@app.route('/api/traffic')
def get_traffic():
    """
    Get traffic logs.
    """
    limit = request.args.get('limit', 100, type=int)
    logs = traffic_service.get_logs(limit)

    return jsonify({
        'success': True,
        'count': len(logs),
        'data': [log.to_dict() for log in logs]
    })

@app.route('/api/traffic/monitor', methods=['POST'])
def monitor_traffic():
    """
    Monitor traffic.
    """
    new_logs, potential_anomalies = traffic_service.monitor_traffic()

    return jsonify({
        'success': True,
        'message': 'Traffic monitored successfully',
        'newLogs': len(new_logs),
        'potentialAnomalies': len(potential_anomalies)
    })

@app.route('/api/traffic/clear', methods=['POST'])
def clear_traffic():
    """
    Clear traffic logs.
    """
    traffic_service.clear_logs()

    return jsonify({
        'success': True,
        'message': 'Traffic logs cleared'
    })

@app.route('/api/anomalies')
def get_anomalies():
    """
    Get anomalies.
    """
    limit = request.args.get('limit', 100, type=int)
    include_resolved = request.args.get('includeResolved', 'false').lower() == 'true'

    anomalies = anomaly_service.get_anomalies(limit, include_resolved)

    return jsonify({
        'success': True,
        'count': len(anomalies),
        'data': [anomaly.to_dict() for anomaly in anomalies]
    })

@app.route('/api/anomalies/<anomaly_id>/resolve', methods=['POST'])
def resolve_anomaly(anomaly_id):
    """
    Resolve an anomaly.
    """
    resolved_by = request.json.get('resolvedBy')
    success = anomaly_service.resolve_anomaly(anomaly_id, resolved_by)

    if success:
        return jsonify({
            'success': True,
            'message': 'Anomaly resolved successfully'
        })
    else:
        return jsonify({
            'success': False,
            'message': 'Failed to resolve anomaly'
        }), 500

@app.route('/api/anomalies/generate', methods=['POST'])
def generate_anomalies():
    """
    Generate dummy anomalies.
    """
    count = request.json.get('count', 5)
    anomalies = anomaly_service.generate_dummy_anomalies(count)

    return jsonify({
        'success': True,
        'message': f'Generated {len(anomalies)} dummy anomalies',
        'count': len(anomalies)
    })

@app.route('/api/websocket/connect', methods=['POST'])
def connect_websocket():
    """
    Connect to the WebSocket server.
    """
    websocket_client.start()

    return jsonify({
        'success': True,
        'message': 'WebSocket client started'
    })

@app.route('/api/websocket/disconnect', methods=['POST'])
def disconnect_websocket():
    """
    Disconnect from the WebSocket server.
    """
    websocket_client.stop()

    return jsonify({
        'success': True,
        'message': 'WebSocket client stopped'
    })

@app.route('/api/websocket/status', methods=['GET'])
def websocket_status():
    """
    Get WebSocket connection status.
    """
    return jsonify({
        'success': True,
        'connected': websocket_client.connected
    })

@app.route('/api/mongodb/status', methods=['GET'])
def mongodb_status():
    """
    Get MongoDB connection status.
    """
    return jsonify({
        'success': True,
        'connected': mongodb_service.connected
    })

@app.route('/api/mongodb/collections', methods=['GET'])
def mongodb_collections():
    """
    Get MongoDB collections.
    """
    if not mongodb_service.connected:
        if not mongodb_service.connect():
            return jsonify({
                'success': False,
                'message': 'Not connected to MongoDB'
            }), 500

    try:
        collections = mongodb_service.db.list_collection_names()
        return jsonify({
            'success': True,
            'collections': collections
        })
    except Exception as e:
        logger.error(f"Error getting MongoDB collections: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Error getting collections: {str(e)}'
        }), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'message': 'Resource not found'
    }), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({
        'success': False,
        'message': 'Internal server error'
    }), 500

# Initialize the application
def init_app():
    """
    Initialize the application.
    """
    # Create data directory if it doesn't exist
    os.makedirs(os.path.join(os.path.dirname(__file__), 'data'), exist_ok=True)
    os.makedirs(os.path.join(os.path.dirname(__file__), 'logs'), exist_ok=True)

    logger.info("Starting endpoint client application")
    logger.info(f"Server URL: {Config.SERVER_URL}")
    logger.info(f"WebSocket URL: {Config.WS_URL}")

    # Skip MongoDB connection for now and use local storage
    logger.info("Running in standalone mode with local storage")

    # Generate dummy data for testing
    logger.info("Generating dummy data for testing")

    # Generate dummy rules
    logger.info("Generating dummy firewall rules")
    firewall_service.generate_dummy_rules(10)

    # Generate dummy traffic
    logger.info("Generating dummy traffic logs")
    for _ in range(5):
        traffic_service.monitor_traffic()

    # Generate dummy anomalies
    logger.info("Generating dummy anomalies")
    anomaly_service.generate_dummy_anomalies(3)

    # Try to register with the server if no endpoint ID (but continue if it fails)
    if not Config.ENDPOINT_ID:
        logger.info("No endpoint ID found, attempting to register with server")
        try:
            success, endpoint_id = auth_service.register_endpoint()
            if success:
                logger.info(f"Successfully registered with server, endpoint ID: {endpoint_id}")
        except Exception as e:
            logger.warning(f"Failed to register with server: {str(e)}")
    else:
        logger.info(f"Using existing endpoint ID: {Config.ENDPOINT_ID}")

    # Start background tasks
    logger.info("Starting background tasks")
    background_thread = threading.Thread(target=run_scheduled_tasks)
    background_thread.daemon = True
    background_thread.start()

    # Don't start WebSocket client for now
    logger.info("Skipping WebSocket client initialization")

    logger.info("Application initialized successfully")

# Run the application
if __name__ == '__main__':
    # Initialize the application
    init_app()

    # Run the Flask app
    app.run(host='0.0.0.0', port=5000)
