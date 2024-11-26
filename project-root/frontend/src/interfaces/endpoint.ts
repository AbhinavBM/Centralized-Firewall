export interface Endpoint {
    id: string; // UUID
    hostname: string;
    os: string | null;
    ip_address: string;
    status: 'online' | 'offline';
    last_sync: string; // Timestamp
    created_at: string; // Timestamp
    updated_at: string; // Timestamp
}
