export interface Log {
    id: number;
    endpoint_id: string;
    source_ip: string;
    destination_ip: string;
    source_port: number;
    destination_port: number;
    protocol: string;
    action: string;
    timestamp: string;
  }
  
  export interface LogResponse {
    logs: Log[];
    totalCount: number;
  }
  