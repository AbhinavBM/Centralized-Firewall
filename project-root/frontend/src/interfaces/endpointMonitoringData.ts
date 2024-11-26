export interface EndpointMonitoringData {
    id: string; // UUID
    endpoint_id: string; // Reference to Endpoint
    cpu_usage: number; // Percentage
    memory_usage: number; // Percentage
    disk_usage: number; // Percentage
    timestamp: string; // Timestamp
}
