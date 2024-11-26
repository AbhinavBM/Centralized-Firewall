export interface SystemNotification {
    id: string; // UUID
    user_id: string; // Reference to User
    message: string;
    status: 'read' | 'unread';
    timestamp: string; // Timestamp
}
