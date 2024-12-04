export interface Application {
    id: string;
    name: string;
    description?: string;
    status: 'allowed' | 'blocked' | 'pending' | 'suspended'; // Matches the ENUM values
    allowed_domains: string[];
    allowed_ips: string[];
    allowed_protocols: string[];
    firewall_policies: Record<string, any>; // Represent JSONB field as a flexible object
    created_at: string; // ISO timestamp
    updated_at: string; // ISO timestamp
  }
  