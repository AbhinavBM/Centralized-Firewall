import { Application, EndpointReference } from './application.types';

export interface FirewallRule {
  _id: string;
  // NGFW fields
  endpointId?: string | EndpointReference;
  processName?: string;
  entity_type?: 'ip' | 'domain';
  source_ip?: string | null;
  destination_ip?: string | null;
  source_port?: number | null;
  destination_port?: number | null;
  domain_name?: string | null;
  action: 'allow' | 'deny' | 'ALLOW' | 'DENY';

  // Common fields
  applicationId?: string | Application;
  name?: string;
  description?: string | null;
  priority: number;
  enabled: boolean;

  // Legacy frontend fields (backward compatibility)
  entityType?: 'ip' | 'domain';
  domain?: string | null;
  sourceIp?: string | null;
  destinationIp?: string | null;
  sourcePort?: number | null;
  destinationPort?: number | null;
  protocol?: 'TCP' | 'UDP' | 'ICMP' | 'ANY';

  createdAt: string;
  updatedAt: string;
}

export interface FirewallRuleState {
  rules: FirewallRule[];
  selectedRule: FirewallRule | null;
  loading: boolean;
  error: string | null;
}

export interface FirewallRuleFormData {
  // NGFW fields
  endpointId?: string;
  processName?: string;
  entity_type?: 'ip' | 'domain';
  source_ip?: string;
  destination_ip?: string;
  source_port?: number | null;
  destination_port?: number | null;
  domain_name?: string;
  action: 'allow' | 'deny' | 'ALLOW' | 'DENY';

  // Common fields
  applicationId?: string;
  name?: string;
  description?: string;
  priority: number;
  enabled: boolean;

  // Legacy frontend fields
  entityType?: 'ip' | 'domain';
  domain?: string;
  sourceIp?: string;
  destinationIp?: string;
  sourcePort?: number | null;
  destinationPort?: number | null;
  protocol?: 'TCP' | 'UDP' | 'ICMP' | 'ANY';
}

// Statistics interfaces
export interface FirewallStats {
  total: number;
  byAction: Record<string, number>;
  byEntityType: Record<string, number>;
  byEndpoint: Array<{
    _id: string;
    hostname: string;
    count: number;
  }>;
  recent: FirewallRule[];
}
