export interface Anomaly {
    id: string; // UUID
    endpoint_id: string; // Reference to Endpoint
    application_id: string; // Reference to Application
    anomaly_type: string;
    description: string | null;
    timestamp: string; // Timestamp
    severity: 'low' | 'medium' | 'high';
}
