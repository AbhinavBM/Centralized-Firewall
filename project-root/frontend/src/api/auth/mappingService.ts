import axios from 'axios';
import { Mapping } from '../../interfaces/mapping';  // Assuming Mapping interface is defined in this path.

const API_URL = 'http://localhost:3000/api/mappings';

// Create a new mapping
export const createMapping = async (
  endpoint_id: string,
  application_id: string
): Promise<Mapping> => {
  try {
    const response = await axios.post<Mapping>(`${API_URL}`, { endpoint_id, application_id });
    return response.data;
  } catch (error: unknown) {
    handleAxiosError(error, 'creating mapping');
  }
};

// Get all mappings
export const fetchMappings = async (): Promise<Mapping[]> => {
  try {
    const response = await axios.get<Mapping[]>(API_URL);
    return response.data;
  } catch (error: unknown) {
    handleAxiosError(error, 'fetching mappings');
  }
};

// Get a specific mapping by ID
export const fetchMappingById = async (id: string): Promise<Mapping | null> => {
  try {
    const response = await axios.get<Mapping>(`${API_URL}/${id}`);
    return response.data;
  } catch (error: unknown) {
    handleAxiosError(error, 'fetching mapping by ID');
  }
};

// Update a mapping
export const updateMapping = async (
  id: string,
  endpoint_id: string,
  application_id: string,
  status: string
): Promise<Mapping> => {
  try {
    const response = await axios.put<Mapping>(`${API_URL}/${id}`, {
      endpoint_id,
      application_id,
      status,
    });
    return response.data;
  } catch (error: unknown) {
    handleAxiosError(error, 'updating mapping');
  }
};

// Delete a mapping
export const deleteMapping = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return;  // Explicitly return undefined for Promise<void>
  } catch (error: unknown) {
    handleAxiosError(error, 'deleting mapping');
  }
};

// Common error handler for Axios requests
const handleAxiosError = (error: unknown, action: string) => {
  if (axios.isAxiosError(error)) {
    console.error(`Axios error ${action}:`, error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || `Error ${action}`);
  } else {
    console.error(`Unexpected error ${action}:`, error);
    throw new Error(`Unexpected error ${action}`);
  }
};