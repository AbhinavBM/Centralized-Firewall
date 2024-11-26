export interface TrafficAnomalyLog {
    id: string; // UUID
    anomaly_id: string; // Reference to Anomaly
    resolution_status: 'resolved' | 'unresolved';
    timestamp: string; // Timestamp
    resolved_by: string | null; // Reference to User (nullable)
}
