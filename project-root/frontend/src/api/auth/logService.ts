import axios, { AxiosResponse } from 'axios';

const API_URL = 'http://localhost:3000/api/logs'; // Replace with your backend API URL

// Define log type based on your database structure
export interface Log {
  id: number;
  endpoint_id: string;
  source_ip: string;
  destination_ip: string;
  source_port: number;
  destination_port: number;
  protocol: string;
  action: string;
  timestamp: string;
}

export interface PaginatedLogs {
  logs: Log[];
  total: number;
  currentPage: number;
  totalPages: number;
}

// Get all logs with pagination, filtering, and date range
export const getLogs = async (
  page = 1,
  pageSize = 10,
  endpointId?: string,
  appName?: string,
  action?: string,
  protocol?: string,
  startDate?: string,
  endDate?: string
): Promise<PaginatedLogs> => {
  const params = {
    page,
    limit: pageSize,
    endpointId,
    application: appName,
    action,
    protocol,
    startDate,
    endDate,
  };

  try {
    const response: AxiosResponse<PaginatedLogs> = await axios.get(`${API_URL}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw error;
  }
};

// Search logs based on a query
export const searchLogs = async (query: string): Promise<Log[]> => {
  try {
    const response: AxiosResponse<Log[]> = await axios.get(`${API_URL}/search`, { params: { query } });
    return response.data;
  } catch (error) {
    console.error('Error searching logs:', error);
    throw error;
  }
};

// Get logs by date range
export const getLogsByDateRange = async (startDate: string, endDate: string): Promise<Log[]> => {
  try {
    const response: AxiosResponse<Log[]> = await axios.get(`${API_URL}/date-range`, { params: { startDate, endDate } });
    return response.data;
  } catch (error) {
    console.error('Error fetching logs by date range:', error);
    throw error;
  }
};

// Get logs by application
export const getLogsByApplication = async (application: string): Promise<Log[]> => {
  try {
    const response: AxiosResponse<Log[]> = await axios.get(`${API_URL}/application`, { params: { application } });
    return response.data;
  } catch (error) {
    console.error('Error fetching logs by application:', error);
    throw error;
  }
};

// Get logs by protocol
export const getLogsByProtocol = async (protocol: string): Promise<Log[]> => {
  try {
    const response: AxiosResponse<Log[]> = await axios.get(`${API_URL}/protocol`, { params: { protocol } });
    return response.data;
  } catch (error) {
    console.error('Error fetching logs by protocol:', error);
    throw error;
  }
};

// Get logs by endpoint
export const getLogsByEndpoint = async (endpointId: string): Promise<Log[]> => {
  try {
    const response: AxiosResponse<Log[]> = await axios.get(`${API_URL}/endpoint/${endpointId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching logs by endpoint:', error);
    throw error;
  }
};
