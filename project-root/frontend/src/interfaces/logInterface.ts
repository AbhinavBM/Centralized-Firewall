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

export interface PaginatedLogs {
  logs: Log[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface LogFilters {
  endpointId?: string;
  appName?: string;
  action?: string;
  protocol?: string;
  startDate?: string;
  endDate?: string;
}
