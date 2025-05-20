import { apiService } from './api';
import { FirewallRule, FirewallRuleFormData } from '../types/firewall.types';

interface FirewallRuleResponse {
  success: boolean;
  data: FirewallRule;
}

interface FirewallRulesResponse {
  success: boolean;
  count: number;
  data: FirewallRule[];
}

export const firewallService = {
  getAllRules: (): Promise<FirewallRulesResponse> => {
    return apiService.get<FirewallRulesResponse>('/firewall/rules');
  },

  getRuleById: (id: string): Promise<FirewallRuleResponse> => {
    return apiService.get<FirewallRuleResponse>(`/firewall/rules/${id}`);
  },

  getRulesByApplication: (applicationId: string): Promise<FirewallRulesResponse> => {
    return apiService.get<FirewallRulesResponse>(`/firewall/rules/application/${applicationId}`);
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
