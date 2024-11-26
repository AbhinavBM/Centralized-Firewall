export interface WebSocketEvent {
    id: string; // UUID
    event_name: string;
    payload: any; // JSON data
    timestamp: string; // Timestamp
}
