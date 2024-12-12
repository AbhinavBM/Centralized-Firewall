import axios from 'axios';
import { Application } from '../../interfaces/application';

const API_BASE_URL = 'http://localhost:3000/api/applications'; // Backend URL

// Fetch all applications
export const fetchApplications = async (): Promise<Application[]> => {
  const response = await axios.get<Application[]>(API_BASE_URL);
  return response.data;
};

// Fetch a single application by UUID
export const fetchApplicationById = async (id: string): Promise<Application> => {
  const response = await axios.get<Application>(`${API_BASE_URL}/${id}`);
  return response.data;
};

// Create a new application
export const createApplication = async (application: Partial<Application>): Promise<Application> => {
  console.log("HI it is the data");
  // console.log(application);
  
  const response = await axios.post<Application>(API_BASE_URL, application);
  return response.data;
};

// Update an application by UUID
export const updateApplication = async (id: string, application: Partial<Application>): Promise<Application> => {
  try {
    console.log('Application updated:', application);

    const response = await axios.put<Application>(`${API_BASE_URL}/${id}`, application);
    console.log('Application updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating application:', error);
    throw error;
  }
};

// Delete an application by UUID
export const deleteApplication = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};
