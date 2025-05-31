import { apiService } from './api';
import { Application, ApplicationFormData, ApplicationStats } from '../types/application.types';

interface ApplicationResponse {
  success: boolean;
  data: Application;
}

interface ApplicationsResponse {
  success: boolean;
  count: number;
  data: Application[];
}

interface ApplicationStatsResponse {
  success: boolean;
  data: ApplicationStats;
}

export const applicationService = {
  // Get all applications with optional endpoint filter
  getAllApplications: (endpointId?: string): Promise<ApplicationsResponse> => {
    const params = endpointId ? `?endpointId=${endpointId}` : '';
    return apiService.get<ApplicationsResponse>(`/applications${params}`);
  },

  getApplicationById: (id: string): Promise<ApplicationResponse> => {
    return apiService.get<ApplicationResponse>(`/applications/${id}`);
  },

  // Get applications by endpoint
  getApplicationsByEndpoint: (endpointId: string): Promise<ApplicationsResponse> => {
    return apiService.get<ApplicationsResponse>(`/applications/endpoint/${endpointId}`);
  },

  // Get application statistics
  getApplicationStats: (): Promise<ApplicationStatsResponse> => {
    return apiService.get<ApplicationStatsResponse>('/applications/stats');
  },

  createApplication: (applicationData: ApplicationFormData): Promise<ApplicationResponse> => {
    return apiService.post<ApplicationResponse>('/applications', applicationData);
  },

  updateApplication: (id: string, applicationData: Partial<ApplicationFormData>): Promise<ApplicationResponse> => {
    return apiService.put<ApplicationResponse>(`/applications/${id}`, applicationData);
  },

  deleteApplication: (id: string): Promise<{ success: boolean; message: string }> => {
    return apiService.delete<{ success: boolean; message: string }>(`/applications/${id}`);
  }
};
