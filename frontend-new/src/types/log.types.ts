export interface TrafficLog {
  _id: string;
  endpointId: string;
  applicationId: string | null;
  timestamp: string;
  sourceIp: string;
  destinationIp: string;
  protocol: 'TCP' | 'UDP' | 'ICMP';
  status: 'allowed' | 'blocked';
  trafficType: 'inbound' | 'outbound';
  dataTransferred: number;
  sourcePort: number | null;
  destinationPort: number | null;
  packetData: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SystemLog {
  _id: string;
  type: 'system' | 'user' | 'firewall' | 'endpoint' | 'application';
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  details: Record<string, any> | null;
  userId: string | null;
  endpointId: string | null;
  applicationId: string | null;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface LogState {
  trafficLogs: TrafficLog[];
  systemLogs: SystemLog[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LogFilters {
  endpointId?: string;
  applicationId?: string;
  status?: 'allowed' | 'blocked';
  trafficType?: 'inbound' | 'outbound';
  protocol?: 'TCP' | 'UDP' | 'ICMP';
  startDate?: string;
  endDate?: string;
  type?: 'system' | 'user' | 'firewall' | 'endpoint' | 'application';
  level?: 'info' | 'warning' | 'error' | 'critical';
}
