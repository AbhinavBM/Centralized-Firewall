import { apiService } from './api';
import { Endpoint, EndpointFormData, EndpointStats } from '../types/endpoint.types';

interface EndpointResponse {
  success: boolean;
  data: Endpoint;
}

interface EndpointsResponse {
  success: boolean;
  data: Endpoint[];
}

interface EndpointStatsResponse {
  success: boolean;
  data: EndpointStats;
}

export const endpointService = {
  getAllEndpoints: (): Promise<EndpointsResponse> => {
    return apiService.get<EndpointsResponse>('/endpoints');
  },

  getEndpointById: (id: string): Promise<EndpointResponse> => {
    return apiService.get<EndpointResponse>(`/endpoints/${id}`);
  },

  createEndpoint: (endpointData: EndpointFormData): Promise<EndpointResponse> => {
    return apiService.post<EndpointResponse>('/endpoints', endpointData);
  },

  updateEndpoint: (id: string, endpointData: Partial<EndpointFormData>): Promise<EndpointResponse> => {
    return apiService.put<EndpointResponse>(`/endpoints/${id}`, endpointData);
  },

  updateEndpointStatus: (id: string, status: 'online' | 'offline' | 'pending' | 'error'): Promise<EndpointResponse> => {
    return apiService.patch<EndpointResponse>(`/endpoints/${id}/status`, { status });
  },

  // Get endpoint statistics
  getEndpointStats: (): Promise<EndpointStatsResponse> => {
    return apiService.get<EndpointStatsResponse>('/endpoints/stats');
  },

  deleteEndpoint: (id: string): Promise<{ success: boolean; message: string }> => {
    return apiService.delete<{ success: boolean; message: string }>(`/endpoints/${id}`);
  }
};
