import { Anomaly } from './anomaly.types';

export interface SystemOverview {
  endpointCount: number;
  applicationCount: number;
  firewallRuleCount: number;
  activeAnomalyCount: number;
  trafficData: TrafficData[];
  endpointStatusData: EndpointStatusData[];
  recentAnomalies: Anomaly[];
}

export interface TrafficData {
  date: string;
  allowed: number;
  blocked: number;
}

export interface EndpointStatusData {
  status: string;
  count: number;
}

export interface DashboardState {
  overview: SystemOverview | null;
  loading: boolean;
  error: string | null;
}
