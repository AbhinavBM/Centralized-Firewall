export interface ApplicationLog {
    id: string; // UUID
    application_id: string; // Reference to Application
    log_level: 'info' | 'warn' | 'error' | 'critical';
    message: string;
    timestamp: string; // Timestamp
}
