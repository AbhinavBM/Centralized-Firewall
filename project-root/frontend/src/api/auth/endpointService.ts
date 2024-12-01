import axios from 'axios';
import { Endpoint } from '../../interfaces/endpoint'; // Import the Endpoint interface

const API_URL = 'http://localhost:3000/api/endpoints';

// Set the authorization token in headers
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Create an endpoint
export const createEndpoint = async (endpointData: Endpoint): Promise<Endpoint> => {
    try {
        const response = await axios.post<Endpoint>(API_URL, endpointData);
        return response.data;
    } catch (error) {
        console.error('Error creating endpoint:', error);
        throw error; // Re-throw the error for further handling
    }
};

// Get all endpoints
export const getAllEndpoints = async (): Promise<Endpoint[]> => {
    try {
        const response = await axios.get<Endpoint[]>(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching endpoints:', error);
        throw error;
    }
};

// Delete an endpoint
export const deleteEndpoint = async (id: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error('Error deleting endpoint:', error);
        throw error;
    }
};

// Update an endpoint
export const updateEndpoint = async (
    id: string,
    data: Partial<Endpoint> // Using the Endpoint interface for update data
): Promise<Endpoint> => {
    try {
        const response = await axios.put<Endpoint>(`${API_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating endpoint:', error);
        throw error;
    }
};

// Download from endpoint (if applicable)
export const downloadFromEndpoint = async (hostname: string, password: string): Promise<any> => {
    try {
        const response = await axios.post(`${API_URL}/download`, { hostname, password });
        return response.data;
    } catch (error) {
        console.error('Error downloading from endpoint:', error);
        throw error;
    }
};
