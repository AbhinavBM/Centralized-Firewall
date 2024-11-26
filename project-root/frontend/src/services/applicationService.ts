import { getApplications, getApplicationDetails, createApplication, updateApplication, deleteApplication } from '../api/endpoints/applicationApi';
import { Application } from '../interfaces/application'; // Assuming Application is defined in the interface

// Service for fetching all applications
export const fetchApplications = async (): Promise<Application[]> => {
    try {
        return await getApplications();
    } catch (error) {
        throw new Error('Error fetching applications');
    }
};

// Service for fetching a single application's details
export const fetchApplicationDetails = async (id: string): Promise<Application> => {
    try {
        return await getApplicationDetails(id);
    } catch (error) {
        throw new Error('Error fetching application details');
    }
};

// Service for creating a new application
export const addApplication = async (application: Application): Promise<Application> => {
    try {
        return await createApplication(application);
    } catch (error) {
        throw new Error('Error creating application');
    }
};

// Service for updating an existing application
export const modifyApplication = async (id: string, application: Application): Promise<Application> => {
    try {
        return await updateApplication(id, application);
    } catch (error) {
        throw new Error('Error updating application');
    }
};

// Service for deleting an application
export const removeApplication = async (id: string): Promise<void> => {
    try {
        return await deleteApplication(id);
    } catch (error) {
        throw new Error('Error deleting application');
    }
};
