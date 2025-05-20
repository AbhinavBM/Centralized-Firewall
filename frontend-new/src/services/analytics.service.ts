import { apiService } from './api';
import { SystemOverview } from '../types/dashboard.types';

interface AnalyticsResponse {
  success: boolean;
  data: any;
}

interface SystemOverviewResponse {
  success: boolean;
  data: SystemOverview;
}

export const analyticsService = {
  getTrafficStats: (): Promise<AnalyticsResponse> => {
    return apiService.get<AnalyticsResponse>('/analytics/traffic');
  },

  getAnomalyStats: (): Promise<AnalyticsResponse> => {
    return apiService.get<AnalyticsResponse>('/analytics/anomalies');
  },

  getSystemOverview: (): Promise<SystemOverviewResponse> => {
    return apiService.get<SystemOverviewResponse>('/analytics/overview');
  }
};
