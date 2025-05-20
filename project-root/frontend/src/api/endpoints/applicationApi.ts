import axios from 'axios';
import { Application } from '../../interfaces/application';

const API_URL = 'http://localhost:3000/api/applications';

// Fetch all applications
export const getApplications = async (): Promise<Application[]> => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching applications');
    }
};

// Fetch details of a single application by ID
export const getApplicationDetails = async (id: string): Promise<Application> => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching application details');
    }
};

// Create a new application
export const createApplication = async (application: Application): Promise<Application> => {
    try {
        const response = await axios.post(API_URL, application);
        return response.data;
    } catch (error) {
        throw new Error('Error creating application');
    }
};

// Update an existing application
export const updateApplication = async (id: string, application: Application): Promise<Application> => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, application);
        return response.data;
    } catch (error) {
        throw new Error('Error updating application');
    }
};

// Delete an application by ID
export const deleteApplication = async (id: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        throw new Error('Error deleting application');
    }
};
