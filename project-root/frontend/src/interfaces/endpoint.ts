export interface Endpoint {
    id: string;          // UUID of the endpoint
    hostname: string;    // Hostname of the endpoint
    os: string | null;   // Operating System of the endpoint (nullable)
    ip_address: string;  // IP address of the endpoint
    status: 'online' | 'offline'; // Current status of the endpoint (online or offline)
    last_sync: string;   // Last sync timestamp (ISO format string)
    created_at: string;  // Creation timestamp (ISO format string)
    updated_at: string;  // Last updated timestamp (ISO format string)
    password?: string;   // Optional non-hashed password (for use cases where plaintext password is needed)
}
