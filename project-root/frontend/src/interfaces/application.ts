export interface Application {
    id: string; // UUID
    endpoint_id: string; // Reference to Endpoint
    name: string;
    status: 'allowed' | 'blocked' | 'pending' | 'suspended';
    created_at: string; // Timestamp
    updated_at: string; // Timestamp
}
