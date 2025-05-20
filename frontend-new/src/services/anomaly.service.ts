import { apiService } from './api';
import { Anomaly, AnomalyFilters } from '../types/anomaly.types';

interface AnomalyResponse {
  success: boolean;
  data: Anomaly;
}

interface AnomaliesResponse {
  success: boolean;
  data: Anomaly[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const anomalyService = {
  getAllAnomalies: (
    page: number = 1,
    limit: number = 20,
    filters?: AnomalyFilters
  ): Promise<AnomaliesResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    if (filters) {
      if (filters.endpointId) queryParams.append('endpointId', filters.endpointId);
      if (filters.applicationId) queryParams.append('applicationId', filters.applicationId);
      if (filters.severity) queryParams.append('severity', filters.severity);
      if (filters.resolved !== undefined) queryParams.append('resolved', filters.resolved.toString());
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
    }

    return apiService.get<AnomaliesResponse>(`/anomalies?${queryParams.toString()}`);
  },

  getAnomalyById: (id: string): Promise<AnomalyResponse> => {
    return apiService.get<AnomalyResponse>(`/anomalies/${id}`);
  },

  getAnomaliesByEndpoint: (
    endpointId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<AnomaliesResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    return apiService.get<AnomaliesResponse>(`/anomalies/endpoint/${endpointId}?${queryParams.toString()}`);
  },

  getAnomaliesByApplication: (
    applicationId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<AnomaliesResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    return apiService.get<AnomaliesResponse>(`/anomalies/application/${applicationId}?${queryParams.toString()}`);
  },

  resolveAnomaly: (id: string): Promise<AnomalyResponse> => {
    return apiService.patch<AnomalyResponse>(`/anomalies/${id}/resolve`, {});
  },

  deleteAnomaly: (id: string): Promise<{ success: boolean; message: string }> => {
    return apiService.delete<{ success: boolean; message: string }>(`/anomalies/${id}`);
  }
};
