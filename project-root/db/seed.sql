-- Seeding Users Table
INSERT INTO users (id, username, password_hash, role, created_at, updated_at)
VALUES
    (gen_random_uuid(), 'admin_user', '$2b$10$encryptedpasswordhash1', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'regular_user', '$2b$10$encryptedpasswordhash2', 'user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Seeding Endpoints Table
INSERT INTO endpoints (hostname, os, ip_address, status, password, created_at, updated_at)
VALUES
    ('server-01', 'Linux', '192.168.1.1', 'active', 'securePass123', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('server-02', 'Windows', '192.168.1.2', 'inactive', 'WindowsPass456', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('server-03', 'MacOS', '192.168.1.3', 'active', 'MacPass789', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('server-04', 'Ubuntu', '192.168.1.4', 'active', 'UbuntuPass234', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('server-05', 'CentOS', '192.168.1.5', 'inactive', 'CentOSPass567', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Seeding Applications Table
-- Insert Random Values into applications table
-- Insert seed data into the applications table
INSERT INTO applications (name, description, status, allowed_domains, allowed_ips, allowed_protocols, firewall_policies, created_at, updated_at)
VALUES
    (
        'Web Application A',
        'Policy for managing web application A',
        'Active',
        ARRAY['example.com', 'api.example.com'],
        ARRAY['192.168.1.1', '10.0.0.5'],
        ARRAY['TCP', 'UDP'],
        '{"rules": [{"action": "allow", "port": 80}, {"action": "allow", "port": 443}]}',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'Internal API',
        'Policy for internal API access',
        'Inactive',
        ARRAY['internal.example.com'],
        ARRAY['172.16.0.2', '172.16.0.3'],
        ARRAY['TCP'],
        '{"rules": [{"action": "deny", "port": 8080}, {"action": "allow", "port": 3000}]}',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'Database Access Policy',
        'Policy for database access control',
        'Active',
        NULL,
        ARRAY['192.168.100.10', '192.168.100.11'],
        ARRAY['TCP'],
        '{"rules": [{"action": "allow", "port": 5432}]}',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'Public API',
        'Policy for public API endpoints',
        'Active',
        ARRAY['api.public.com', 'api2.public.com'],
        NULL,
        ARRAY['TCP', 'UDP'],
        '{"rules": [{"action": "allow", "port": 8000}, {"action": "allow", "port": 9000}]}',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );


-- Seeding Firewall Rules Table
INSERT INTO firewall_rules (id, endpoint_id, application_id, type, domain, ip_address, protocol, created_at, updated_at)
VALUES
    (gen_random_uuid(), 
     (SELECT id FROM endpoints WHERE hostname = 'server-01' LIMIT 1),
     (SELECT id FROM applications WHERE name = 'Nginx' LIMIT 1),
     'allow', 
     'example.com', 
     '192.168.1.100', 
     'TCP', 
     CURRENT_TIMESTAMP, 
     CURRENT_TIMESTAMP),
    (gen_random_uuid(), 
     (SELECT id FROM endpoints WHERE hostname = 'server-02' LIMIT 1),
     NULL, 
     'block', 
     NULL, 
     '192.168.1.101', 
     'UDP', 
     CURRENT_TIMESTAMP, 
     CURRENT_TIMESTAMP);

-- Seeding Traffic Logs Table
INSERT INTO traffic_logs (id, endpoint_id, application_id, timestamp, source_ip, destination_ip, protocol, status, traffic_type, data_transferred)
VALUES
    (gen_random_uuid(), 
     (SELECT id FROM endpoints WHERE hostname = 'server-01' LIMIT 1),
     (SELECT id FROM applications WHERE name = 'Nginx' LIMIT 1),
     CURRENT_TIMESTAMP, 
     '192.168.1.200', 
     '192.168.1.1', 
     'TCP', 
     'allowed', 
     'inbound', 
     1024),
    (gen_random_uuid(), 
     (SELECT id FROM endpoints WHERE hostname = 'server-02' LIMIT 1),
     NULL, 
     CURRENT_TIMESTAMP, 
     '192.168.1.201', 
     '192.168.1.2', 
     'UDP', 
     'blocked', 
     'outbound', 
     2048);

-- Seeding Anomalies Table
INSERT INTO anomalies (id, endpoint_id, application_id, anomaly_type, description, timestamp, severity)
VALUES
    (gen_random_uuid(), 
     (SELECT id FROM endpoints WHERE hostname = 'server-01' LIMIT 1),
     (SELECT id FROM applications WHERE name = 'Nginx' LIMIT 1),
     'Unauthorized Access',
     'Unexpected traffic from suspicious IP 192.168.1.200',
     CURRENT_TIMESTAMP, 
     'high');

-- Seeding WebSocket Events Table
INSERT INTO websocket_events (id, event_name, payload, timestamp)
VALUES
    (gen_random_uuid(), 'connection_established', '{"client_id": "12345"}', CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'firewall_rule_update', '{"rule_id": "67890"}', CURRENT_TIMESTAMP);

-- Seeding Firewall Activity Logs Table
INSERT INTO firewall_activity_logs (id, event_name, description, timestamp, user_id)
VALUES
    (gen_random_uuid(), 'Rule Added', 'Admin added a new firewall rule.', CURRENT_TIMESTAMP, 
     (SELECT id FROM users WHERE username = 'admin_user' LIMIT 1));

-- Seeding Endpoint Firewall Configurations Table
INSERT INTO endpoint_firewall_configurations (id, endpoint_id, configuration, last_updated)
VALUES
    (gen_random_uuid(), 
     (SELECT id FROM endpoints WHERE hostname = 'server-01' LIMIT 1), 
     '{"firewall_mode": "strict", "allowed_ports": [80, 443]}', 
     CURRENT_TIMESTAMP);

-- Seeding Traffic Anomaly Logs Table
INSERT INTO traffic_anomaly_logs (id, anomaly_id, resolution_status, timestamp, resolved_by)
VALUES
    (gen_random_uuid(), 
     (SELECT id FROM anomalies WHERE anomaly_type = 'Unauthorized Access' LIMIT 1), 
     'unresolved', 
     CURRENT_TIMESTAMP, 
     (SELECT id FROM users WHERE username = 'admin_user' LIMIT 1));
