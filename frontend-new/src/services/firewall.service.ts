import { apiService } from './api';
import { FirewallRule, FirewallRuleFormData, FirewallStats } from '../types/firewall.types';

interface FirewallRuleResponse {
  success: boolean;
  data: FirewallRule;
}

interface FirewallRulesResponse {
  success: boolean;
  count: number;
  data: FirewallRule[];
}

interface FirewallStatsResponse {
  success: boolean;
  data: FirewallStats;
}

export const firewallService = {
  // Get all rules with optional filters
  getAllRules: (endpointId?: string, processName?: string): Promise<FirewallRulesResponse> => {
    const params = new URLSearchParams();
    if (endpointId) params.append('endpointId', endpointId);
    if (processName) params.append('processName', processName);
    const queryString = params.toString();
    return apiService.get<FirewallRulesResponse>(`/firewall/rules${queryString ? `?${queryString}` : ''}`);
  },

  getRuleById: (id: string): Promise<FirewallRuleResponse> => {
    return apiService.get<FirewallRuleResponse>(`/firewall/rules/${id}`);
  },

  getRulesByApplication: (applicationId: string): Promise<FirewallRulesResponse> => {
    return apiService.get<FirewallRulesResponse>(`/firewall/rules/application/${applicationId}`);
  },

  // Get rules by endpoint
  getRulesByEndpoint: (endpointId: string): Promise<FirewallRulesResponse> => {
    return apiService.get<FirewallRulesResponse>(`/firewall/rules/endpoint/${endpointId}`);
  },

  // Get firewall statistics
  getFirewallStats: (): Promise<FirewallStatsResponse> => {
    return apiService.get<FirewallStatsResponse>('/firewall/rules/stats');
  },

  createRule: (ruleData: FirewallRuleFormData): Promise<FirewallRuleResponse> => {
    return apiService.post<FirewallRuleResponse>('/firewall/rules', ruleData);
  },

  updateRule: (id: string, ruleData: Partial<FirewallRuleFormData>): Promise<FirewallRuleResponse> => {
    return apiService.put<FirewallRuleResponse>(`/firewall/rules/${id}`, ruleData);
  },

  deleteRule: (id: string): Promise<{ success: boolean; message: string }> => {
    return apiService.delete<{ success: boolean; message: string }>(`/firewall/rules/${id}`);
  }
};
