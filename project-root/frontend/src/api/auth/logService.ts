import axios from 'axios';
import { LogResponse } from '../interfaces/logInterface';

const API_URL = 'http://localhost:3000/api/logs';

export const getLogs = async (page: number, limit: number): Promise<LogResponse> => {
  try {
    const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching logs');
  }
};

export const searchLogs = async (searchQuery: string): Promise<LogResponse> => {
  try {
    const response = await axios.get(`${API_URL}?search=${searchQuery}`);
    return response.data;
  } catch (error) {
    throw new Error('Error searching logs');
  }
};
