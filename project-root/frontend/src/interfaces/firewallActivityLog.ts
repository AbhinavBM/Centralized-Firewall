export interface FirewallActivityLog {
    id: string; // UUID
    event_name: string;
    description: string | null;
    timestamp: string; // Timestamp
    user_id: string; // Reference to User
}
