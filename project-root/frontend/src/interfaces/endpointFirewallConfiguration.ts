export interface EndpointFirewallConfiguration {
    id: string; // UUID
    endpoint_id: string; // Reference to Endpoint
    configuration: any; // JSON data
    last_updated: string; // Timestamp
}
