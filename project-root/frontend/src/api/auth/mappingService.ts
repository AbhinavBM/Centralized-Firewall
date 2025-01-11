import axios from 'axios';

const API_URL = 'http://localhost:3000/api/mapping';  // Adjust the base URL as per your server configuration
// mappingService.ts

// Function to get applications mapped to an endpoint
export const getApplicationsByEndpoint = async (endpointId: string) => {
    try {
        const response = await axios.get(`${API_URL}/endpoints/${endpointId}/applications`);
        return response.data;
    } catch (error) {
        console.error('Error fetching applications:', error);
        throw error;
    }
};

// Function to add an application to an endpoint
export const addApplicationToEndpoint = async (endpointId: string, applicationId: string) => {
    try {
        const response = await axios.post(`${API_URL}/endpoints/${endpointId}/applications`, { application_id: applicationId });
        return response.data;
    } catch (error) {
        console.error('Error adding application:', error);
        throw error;
    }
};

// Function to remove an application from an endpoint
export const removeApplicationFromEndpoint = async (endpointId: string, applicationId: string) => {
    try {
        const response = await axios.delete(`${API_URL}/endpoints/${endpointId}/applications/${applicationId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing application:', error);
        throw error;
    }
};

// Function to get all applications
export const getAllApplications = async () => {
    try {
        const response = await axios.get(`${API_URL}/applications`);
        return response.data;
    } catch (error) {
        console.error('Error fetching all applications:', error);
        throw error;
    }
};

// Function to search for applications
export const searchApplications = async (query: string) => {
    try {
        const response = await axios.get(`${API_URL}/applications/search`, { params: { query } });
        return response.data;
    } catch (error) {
        console.error('Error searching applications:', error);
        throw error;
    }
};

// Function to update the application status
export const updateApplicationStatus = async (endpointId: string, applicationId: string, status: string) => {
    try {
        const response = await axios.put(`${API_URL}/endpoints/${endpointId}/applications/${applicationId}`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating application status:', error);
        throw error;
    }
};
