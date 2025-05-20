import json
import random
import string
import socket
import ipaddress
import platform
import uuid
import time
from datetime import datetime

def generate_random_id(length=8):
    """Generate a random ID string."""
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

def get_timestamp():
    """Get current timestamp in ISO format."""
    return datetime.utcnow().isoformat()

def get_system_info():
    """Get basic system information."""
    return {
        'hostname': socket.gethostname(),
        'os': platform.system(),
        'os_version': platform.version(),
        'architecture': platform.machine(),
        'processor': platform.processor(),
        'python_version': platform.python_version()
    }

def generate_random_ip():
    """Generate a random IP address."""
    return str(ipaddress.IPv4Address(random.randint(0, 2**32 - 1)))

def generate_random_port():
    """Generate a random port number."""
    return random.randint(1024, 65535)

def generate_random_protocol():
    """Generate a random protocol."""
    return random.choice(['TCP', 'UDP', 'ICMP'])

def generate_random_traffic_type():
    """Generate a random traffic type."""
    return random.choice(['inbound', 'outbound'])

def generate_random_status():
    """Generate a random status."""
    return random.choice(['allowed', 'blocked'])

def generate_random_data_transferred():
    """Generate a random amount of data transferred."""
    return random.randint(100, 10000)

def generate_random_traffic_log():
    """Generate a random traffic log."""
    return {
        'sourceIp': generate_random_ip(),
        'destinationIp': generate_random_ip(),
        'sourcePort': generate_random_port(),
        'destinationPort': generate_random_port(),
        'protocol': generate_random_protocol(),
        'trafficType': generate_random_traffic_type(),
        'status': generate_random_status(),
        'dataTransferred': generate_random_data_transferred(),
        'timestamp': get_timestamp()
    }

def is_anomaly(traffic_log, threshold=1000):
    """Simple dummy anomaly detection based on data transferred."""
    # This is a very simple dummy implementation
    # In a real system, this would be much more sophisticated
    return traffic_log['dataTransferred'] > threshold

def generate_anomaly_from_traffic(traffic_log, severity=None):
    """Generate an anomaly from a traffic log."""
    if severity is None:
        severity = random.choice(['low', 'medium', 'high'])
    
    anomaly_types = [
        'excessive_data_transfer',
        'unusual_port_access',
        'suspicious_ip_connection',
        'protocol_violation',
        'unusual_traffic_pattern'
    ]
    
    return {
        'anomalyType': random.choice(anomaly_types),
        'description': f"Detected anomaly in traffic from {traffic_log['sourceIp']} to {traffic_log['destinationIp']}",
        'severity': severity,
        'timestamp': get_timestamp(),
        'resolved': False
    }
