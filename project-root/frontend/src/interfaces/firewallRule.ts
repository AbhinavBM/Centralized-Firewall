export interface FirewallRule {
    id: string; // UUID
    endpoint_id: string; // Reference to Endpoint
    application_id: string; // Reference to Application
    type: 'block' | 'allow';
    domain: string | null;
    ip_address: string | null;
    protocol: 'TCP' | 'UDP' | 'ICMP';
    created_at: string; // Timestamp
    updated_at: string; // Timestamp
}
