import { getEndpoints, getEndpointDetails, createEndpoint, updateEndpoint, deleteEndpoint } from '../api/endpoints/endpointApi';
import { Endpoint } from '../interfaces/endpoint'; // Assuming Endpoint is defined in the interface

// Service for fetching all endpoints
export const fetchEndpoints = async (): Promise<Endpoint[]> => {
    try {
        return await getEndpoints();
    } catch (error) {
        throw new Error('Error fetching endpoints');
    }
};

// Service for fetching a single endpoint's details
export const fetchEndpointDetails = async (id: string): Promise<Endpoint> => {
    try {
        return await getEndpointDetails(id);
    } catch (error) {
        throw new Error('Error fetching endpoint details');
    }
};

// Service for creating a new endpoint
export const addEndpoint = async (endpoint: Endpoint): Promise<Endpoint> => {
    try {
        return await createEndpoint(endpoint);
    } catch (error) {
        throw new Error('Error creating endpoint');
    }
};

// Service for updating an existing endpoint
export const modifyEndpoint = async (id: string, endpoint: Endpoint): Promise<Endpoint> => {
    try {
        return await updateEndpoint(id, endpoint);
    } catch (error) {
        throw new Error('Error updating endpoint');
    }
};

// Service for deleting an endpoint
export const removeEndpoint = async (id: string): Promise<void> => {
    try {
        return await deleteEndpoint(id);
    } catch (error) {
        throw new Error('Error deleting endpoint');
    }
};
