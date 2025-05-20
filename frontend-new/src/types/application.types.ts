export interface Application {
  _id: string;
  name: string;
  description: string;
  status: 'allowed' | 'blocked' | 'pending' | 'suspended';
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
  name: string;
  description: string;
  status: 'allowed' | 'blocked' | 'pending' | 'suspended';
  allowedDomains: string[];
  allowedIps: string[];
  allowedProtocols: string[];
  firewallPolicies?: Record<string, any>;
}
