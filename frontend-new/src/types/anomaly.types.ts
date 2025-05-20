import { Endpoint } from './endpoint.types';
import { Application } from './application.types';
import { User } from './auth.types';

export interface Anomaly {
  _id: string;
  endpointId: string | Endpoint;
  applicationId: string | Application | null;
  anomalyType: string;
  description: string | null;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
  resolvedBy: string | User | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AnomalyState {
  anomalies: Anomaly[];
  selectedAnomaly: Anomaly | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AnomalyFilters {
  endpointId?: string;
  applicationId?: string;
  severity?: 'low' | 'medium' | 'high';
  resolved?: boolean;
  startDate?: string;
  endDate?: string;
}
