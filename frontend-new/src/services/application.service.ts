import { apiService } from './api';
import { Application, ApplicationFormData } from '../types/application.types';

interface ApplicationResponse {
  success: boolean;
  data: Application;
}

interface ApplicationsResponse {
  success: boolean;
  data: Application[];
}

export const applicationService = {
  getAllApplications: (): Promise<ApplicationsResponse> => {
    return apiService.get<ApplicationsResponse>('/applications');
  },

  getApplicationById: (id: string): Promise<ApplicationResponse> => {
    return apiService.get<ApplicationResponse>(`/applications/${id}`);
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
