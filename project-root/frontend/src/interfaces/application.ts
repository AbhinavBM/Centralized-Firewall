export interface Application {
  id: string;
  name: string;
  description: string;
  status: 'allowed' | 'blocked' | 'pending' | 'suspended';
  allowed_domains: string[];
  allowed_ips: string[];
  allowed_protocols: string[];
  firewall_policies: Record<string, any>;
  created_at: string;
  updated_at: string;
}
