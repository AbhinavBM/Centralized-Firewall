export interface User {
    id: string; // UUID
    username: string;
    password_hash: string;
    role: 'admin' | 'user';
    created_at: string; // Timestamp
    updated_at: string; // Timestamp
}
