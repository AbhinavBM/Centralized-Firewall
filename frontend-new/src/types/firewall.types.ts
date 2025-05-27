import { Application } from './application.types';

export interface FirewallRule {
  _id: string;
  applicationId: string | Application;
  name: string;
  description: string | null;
  entityType: 'ip' | 'domain';
  domain: string | null;
  sourceIp: string | null;
  destinationIp: string | null;
  sourcePort: number | null;
  destinationPort: number | null;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'ANY';
  action: 'ALLOW' | 'DENY';
  priority: number;
  enabled: boolean;
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
  applicationId: string;
  name: string;
  description?: string;
  entityType: 'ip' | 'domain';
  domain?: string;
  sourceIp?: string;
  destinationIp?: string;
  sourcePort?: number | null;
  destinationPort?: number | null;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'ANY';
  action: 'ALLOW' | 'DENY';
  priority: number;
  enabled: boolean;
}
