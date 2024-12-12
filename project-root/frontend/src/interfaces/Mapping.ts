// src/types.ts

export interface Endpoint {
  id: string;
  hostname: string;
}

export interface Application {
  id: string;
  name: string;
  description?: string;
}

export interface Mapping {
  endpoint: Endpoint;
  applications: Application[];
}

export interface MappingRequest {
  endpoint_id: string;
  application_id: string;
  status: string;
}

export interface MappingResponse {
  endpoint_id: string;
  applications: Application[];
}

export interface UpdateMappingRequest {
  endpoint_id: string;
  application_id: string;
  status: string;
}
