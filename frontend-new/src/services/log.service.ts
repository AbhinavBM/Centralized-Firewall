import { apiService } from './api';
import { TrafficLog, SystemLog, LogFilters } from '../types/log.types';

interface TrafficLogsResponse {
  success: boolean;
  data: TrafficLog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

interface SystemLogsResponse {
  success: boolean;
  data: SystemLog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const logService = {
  getTrafficLogs: (
    page: number = 1,
    limit: number = 20,
    filters?: LogFilters
  ): Promise<TrafficLogsResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    if (filters) {
      if (filters.endpointId) queryParams.append('endpointId', filters.endpointId);
      if (filters.applicationId) queryParams.append('applicationId', filters.applicationId);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.trafficType) queryParams.append('trafficType', filters.trafficType);
      if (filters.protocol) queryParams.append('protocol', filters.protocol);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
    }

    return apiService.get<TrafficLogsResponse>(`/logs/traffic?${queryParams.toString()}`);
  },

  getTrafficLogsByEndpoint: (
    endpointId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<TrafficLogsResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    return apiService.get<TrafficLogsResponse>(`/logs/traffic/endpoint/${endpointId}?${queryParams.toString()}`);
  },

  getTrafficLogsByApplication: (
    applicationId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<TrafficLogsResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    return apiService.get<TrafficLogsResponse>(`/logs/traffic/application/${applicationId}?${queryParams.toString()}`);
  },

  getSystemLogs: (
    page: number = 1,
    limit: number = 20,
    filters?: LogFilters
  ): Promise<SystemLogsResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    if (filters) {
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.level) queryParams.append('level', filters.level);
      if (filters.endpointId) queryParams.append('endpointId', filters.endpointId);
      if (filters.applicationId) queryParams.append('applicationId', filters.applicationId);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
    }

    return apiService.get<SystemLogsResponse>(`/logs/system?${queryParams.toString()}`);
  }
};
