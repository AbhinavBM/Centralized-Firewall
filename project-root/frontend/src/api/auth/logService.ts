import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Adjust the URL based on your backend

// Define types for logs and query parameters
export interface Log {
  id: number;
  source_ip: string;
  destination_ip: string;
  source_port: number;
  destination_port: number;
  protocol: string;
  source_service?: string;
  destination_service?: string;
  domain?: string;
  logged_at: string;
}

export interface LogQueryParams {
  page?: number;
  limit?: number;
  source_ip?: string;
  destination_ip?: string;
  protocol?: string;
  source_service?: string;
  destination_service?: string;
  domain?: string;
  startDate?: string;
  endDate?: string;
}

const logService = {
  // Get all logs with pagination and filtering
  getLogs: async (params: LogQueryParams): Promise<{ logs: Log[]; total: number; currentPage: number; totalPages: number }> => {
    const response = await axios.get(`${API_URL}/logs`, { params });
    return response.data;
  },

  // Search logs based on query
  searchLogs: async (query: string): Promise<Log[]> => {
    const response = await axios.get(`${API_URL}/logs/search`, { params: { query } });
    return response.data;
  },

  // Get logs by date range
  getLogsByDateRange: async (startDate: string, endDate: string): Promise<Log[]> => {
    const response = await axios.get(`${API_URL}/logs/date-range`, { params: { startDate, endDate } });
    return response.data;
  },

  // Get logs by protocol
  getLogsByProtocol: async (protocol: string): Promise<Log[]> => {
    const response = await axios.get(`${API_URL}/logs/protocol`, { params: { protocol } });
    return response.data;
  },

  // Create a new log entry
  createLog: async (logData: Omit<Log, 'id' | 'logged_at'>): Promise<Log> => {
    const response = await axios.post(`${API_URL}/logs`, logData);
    return response.data;
  },
};

export default logService;
