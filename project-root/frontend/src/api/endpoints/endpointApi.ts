import axios from 'axios';
import { Endpoint } from '../../interfaces/endpoint';

const API_URL = 'http://localhost:3000/api/endpoints';

// Fetch all endpoints
export const getEndpoints = async (): Promise<Endpoint[]> => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching endpoints');
    }
};

// Fetch details of a single endpoint by ID
export const getEndpointDetails = async (id: string): Promise<Endpoint> => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching endpoint details');
    }
};

// Fetch all endpoints (alternative naming if needed)
export const fetchEndpoints = async (): Promise<Endpoint[]> => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching endpoints');
    }
};

// Create a new endpoint
export const createEndpoint = async (endpoint: Endpoint): Promise<Endpoint> => {
    try {
        const response = await axios.post(API_URL, endpoint);
        return response.data;
    } catch (error) {
        throw new Error('Error creating endpoint');
    }
};

// Update an existing endpoint
export const updateEndpoint = async (id: string, endpoint: Endpoint): Promise<Endpoint> => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, endpoint);
        return response.data;
    } catch (error) {
        throw new Error('Error updating endpoint');
    }
};

// Delete an endpoint by ID
export const deleteEndpoint = async (id: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        throw new Error('Error deleting endpoint');
    }
};
