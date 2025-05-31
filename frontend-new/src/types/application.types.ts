// IP Association interface for NGFW applications
export interface IpAssociation {
  source_ip: string;
  destination_ip: string;
}

// Endpoint reference interface
export interface EndpointReference {
  _id: string;
  hostname: string;
  ipAddress: string;
  status: string;
}

export interface Application {
  _id: string;
  // NGFW fields
  endpointId?: string | EndpointReference;
  processName?: string;
  associated_ips?: IpAssociation[];
  source_ports?: number[];
  destination_ports?: number[];
  lastUpdated?: string;

  // Common fields
  name: string;
  description: string;
  status: 'running' | 'stopped' | 'pending' | 'allowed' | 'blocked' | 'suspended';

  // Legacy frontend fields (backward compatibility)
  allowedDomains: string[];
  allowedIps: string[];
  allowedProtocols: string[];
  firewallPolicies: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationState {
  applications: Application[];
  selectedApplication: Application | null;
  loading: boolean;
  error: string | null;
}

export interface ApplicationFormData {
  // NGFW fields
  endpointId?: string;
  processName?: string;
  associated_ips?: IpAssociation[];
  source_ports?: number[];
  destination_ports?: number[];

  // Common fields
  name: string;
  description: string;
  status: 'running' | 'stopped' | 'pending' | 'allowed' | 'blocked' | 'suspended';

  // Legacy frontend fields
  allowedDomains: string[];
  allowedIps: string[];
  allowedProtocols: string[];
  firewallPolicies?: Record<string, any>;
}

// Statistics interfaces
export interface ApplicationStats {
  total: number;
  byStatus: Record<string, number>;
  byEndpoint: Array<{
    _id: string;
    hostname: string;
    count: number;
  }>;
  recent: Application[];
}
