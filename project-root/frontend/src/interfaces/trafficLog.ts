export interface TrafficLog {
    id: string; // UUID
    endpoint_id: string; // Reference to Endpoint
    application_id: string; // Reference to Application
    timestamp: string; // Timestamp
    source_ip: string;
    destination_ip: string;
    protocol: 'TCP' | 'UDP' | 'ICMP';
    status: 'allowed' | 'blocked';
    traffic_type: 'inbound' | 'outbound';
    data_transferred: number; // Data in bytes
}
