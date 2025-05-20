import { Application } from './application.types';
import { Endpoint } from './endpoint.types';

export interface EndpointApplicationMapping {
  _id: string;
  endpointId: string;
  applicationId: string;
  status: 'active' | 'inactive' | 'pending' | 'error';
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface MappingWithDetails extends EndpointApplicationMapping {
  endpoint?: Endpoint;
  application?: Application;
}

export interface MappingState {
  mappings: EndpointApplicationMapping[];
  mappingsWithDetails: MappingWithDetails[];
  loading: boolean;
  error: string | null;
}

export interface CreateMappingData {
  endpointId: string;
  applicationId: string;
  status?: 'active' | 'inactive' | 'pending' | 'error';
}
