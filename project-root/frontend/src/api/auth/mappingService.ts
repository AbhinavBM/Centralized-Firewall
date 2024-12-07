import axios from 'axios';
import { Mapping } from '../../interfaces/mapping';  // Assuming Mapping interface is defined in this path.

const API_URL = 'http://localhost:3000/api/mappings';

// Create a new mapping
export const createMapping = async (
  endpoint_id: string,
  application_id: string
): Promise<Mapping> => {
  try {
    const response = await axios.post<Mapping>(API_URL, { endpoint_id, application_id });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific error
      console.error('Axios error creating mapping:', error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error creating mapping');
    } else {
      // Handle other types of errors
      console.error('Unexpected error creating mapping:', error);
      throw new Error('Unexpected error creating mapping');
    }
  }
};

// Get all mappings
export const fetchMappings = async (): Promise<Mapping[]> => {
  try {
    const response = await axios.get<Mapping[]>(API_URL);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific error
      console.error('Axios error fetching mappings:', error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error fetching mappings');
    } else {
      // Handle other types of errors
      console.error('Unexpected error fetching mappings:', error);
      throw new Error('Unexpected error fetching mappings');
    }
  }
};

// Get a specific mapping by ID
export const fetchMappingById = async (id: string): Promise<Mapping | null> => {
  try {
    const response = await axios.get<Mapping>(`${API_URL}/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific error
      console.error('Axios error fetching mapping by ID:', error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error fetching mapping');
    } else {
      // Handle other types of errors
      console.error('Unexpected error fetching mapping:', error);
      throw new Error('Unexpected error fetching mapping');
    }
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
    const response = await axios.put<Mapping>(`${API_URL}/${id}`, { endpoint_id, application_id, status });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific error
      console.error('Axios error updating mapping:', error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error updating mapping');
    } else {
      // Handle other types of errors
      console.error('Unexpected error updating mapping:', error);
      throw new Error('Unexpected error updating mapping');
    }
  }
};

// Delete a mapping
export const deleteMapping = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific error
      console.error('Axios error deleting mapping:', error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error deleting mapping');
    } else {
      // Handle other types of errors
      console.error('Unexpected error deleting mapping:', error);
      throw new Error('Unexpected error deleting mapping');
    }
  }
};
