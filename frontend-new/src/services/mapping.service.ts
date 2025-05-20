import { apiService } from './api';
import { EndpointApplicationMapping, CreateMappingData, MappingWithDetails } from '../types/mapping.types';

interface MappingResponse {
  success: boolean;
  data: EndpointApplicationMapping;
}

interface MappingsResponse {
  success: boolean;
  data: EndpointApplicationMapping[];
}

interface MappingsWithDetailsResponse {
  success: boolean;
  data: MappingWithDetails[];
}

export const mappingService = {
  getAllMappings: (): Promise<MappingsResponse> => {
    return apiService.get<MappingsResponse>('/mapping');
  },

  getMappingsByEndpoint: (endpointId: string): Promise<MappingsResponse> => {
    return apiService.get<MappingsResponse>(`/mapping/endpoint/${endpointId}`);
  },

  getMappingsByApplication: (applicationId: string): Promise<MappingsResponse> => {
    return apiService.get<MappingsResponse>(`/mapping/application/${applicationId}`);
  },

  createMapping: (mappingData: CreateMappingData): Promise<MappingResponse> => {
    return apiService.post<MappingResponse>('/mapping', mappingData);
  },

  updateMappingStatus: (id: string, status: 'active' | 'inactive' | 'pending' | 'error'): Promise<MappingResponse> => {
    return apiService.patch<MappingResponse>(`/mapping/${id}`, { status });
  },

  deleteMapping: (id: string): Promise<{ success: boolean; message: string }> => {
    return apiService.delete<{ success: boolean; message: string }>(`/mapping/${id}`);
  }
};
