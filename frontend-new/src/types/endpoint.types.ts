export interface Endpoint {
  _id: string;
  hostname: string;
  os: string | null;
  ipAddress: string;
  status: 'online' | 'offline' | 'pending' | 'error';
  password?: string;
  applicationIds: string[];
  lastHeartbeat: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EndpointState {
  endpoints: Endpoint[];
  selectedEndpoint: Endpoint | null;
  loading: boolean;
  error: string | null;
}

export interface EndpointFormData {
  hostname: string;
  os: string | null;
  ipAddress: string;
  status: 'online' | 'offline' | 'pending' | 'error';
  password?: string;
}
