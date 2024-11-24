-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'user')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Endpoints Table
CREATE TABLE endpoints (
    id UUID PRIMARY KEY,
    hostname VARCHAR(255) NOT NULL,
    os VARCHAR(255),
    ip_address VARCHAR(15) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('online', 'offline')) NOT NULL,
    last_sync TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create the enum for application status
CREATE TYPE application_status AS ENUM ('allowed', 'blocked', 'pending', 'suspended');

-- Create the applications table with foreign key references
CREATE TABLE applications (
    id UUID PRIMARY KEY,
    endpoint_id UUID REFERENCES endpoints(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    status application_status NOT NULL, -- Using ENUM for better scalability
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Trigger function to automatically update the `updated_at` field
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger to update `updated_at` before update
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- Firewall Rules Table
CREATE TABLE firewall_rules (
    id UUID PRIMARY KEY,
    endpoint_id UUID REFERENCES endpoints(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    type VARCHAR(20) CHECK (type IN ('block', 'allow')) NOT NULL,
    domain VARCHAR(255),
    ip_address VARCHAR(15),
    protocol VARCHAR(10) CHECK (protocol IN ('TCP', 'UDP', 'ICMP')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Traffic Logs Table
CREATE TABLE traffic_logs (
    id UUID PRIMARY KEY,
    endpoint_id UUID REFERENCES endpoints(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    source_ip VARCHAR(15) NOT NULL,
    destination_ip VARCHAR(15) NOT NULL,
    protocol VARCHAR(10) CHECK (protocol IN ('TCP', 'UDP', 'ICMP')) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('allowed', 'blocked')) NOT NULL,
    traffic_type VARCHAR(20) CHECK (traffic_type IN ('inbound', 'outbound')) NOT NULL,
    data_transferred BIGINT NOT NULL
);

-- Anomalies Table
CREATE TABLE anomalies (
    id UUID PRIMARY KEY,
    endpoint_id UUID REFERENCES endpoints(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    anomaly_type VARCHAR(50) NOT NULL,
    description TEXT,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high')) NOT NULL
);

-- WebSocket Events Table
CREATE TABLE websocket_events (
    id UUID PRIMARY KEY,
    event_name VARCHAR(50) NOT NULL,
    payload JSONB,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Firewall Activity Logs Table
CREATE TABLE firewall_activity_logs (
    id UUID PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    description TEXT,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE
);

-- Endpoint Application Firewall Configuration Table
CREATE TABLE endpoint_firewall_configurations (
    id UUID PRIMARY KEY,
    endpoint_id UUID REFERENCES endpoints(id) ON DELETE CASCADE,
    configuration JSONB,
    last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Traffic Anomaly Logs Table
CREATE TABLE traffic_anomaly_logs (
    id UUID PRIMARY KEY,
    anomaly_id UUID REFERENCES anomalies(id) ON DELETE CASCADE,
    resolution_status VARCHAR(20) CHECK (resolution_status IN ('resolved', 'unresolved')) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    resolved_by UUID REFERENCES users(id) ON DELETE CASCADE
);

-- Additional Table: Endpoint Monitoring Data (Example)
CREATE TABLE endpoint_monitoring_data (
    id UUID PRIMARY KEY,
    endpoint_id UUID REFERENCES endpoints(id) ON DELETE CASCADE,
    cpu_usage DECIMAL(5, 2) NOT NULL,  -- CPU usage in percentage
    memory_usage DECIMAL(5, 2) NOT NULL, -- Memory usage in percentage
    disk_usage DECIMAL(5, 2) NOT NULL, -- Disk usage in percentage
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Additional Table: System Notifications
CREATE TABLE system_notifications (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('read', 'unread')) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Additional Table: Application Logs
CREATE TABLE application_logs (
    id UUID PRIMARY KEY,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    log_level VARCHAR(20) CHECK (log_level IN ('info', 'warn', 'error', 'critical')) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
