import axios from 'axios';
import { Application } from '../../interfaces/application';

const API_BASE_URL = 'http://localhost:3000/api/applications'; // Backend URL

export const fetchApplications = async (): Promise<Application[]> => {
  const response = await axios.get<Application[]>(API_BASE_URL);
  return response.data;
};

export const fetchApplicationById = async (id: string): Promise<Application> => {
  const response = await axios.get<Application>(`${API_BASE_URL}/${id}`);
  return response.data;
};

export const createApplication = async (application: Partial<Application>): Promise<Application> => {
  console.log("HI it is the data")
  console.log(application);
  
  const response = await axios.post<Application>(API_BASE_URL, application);
  return response.data;
};

export const updateApplication = async (id: string, application: Partial<Application>): Promise<Application> => {
  const response = await axios.put<Application>(`${API_BASE_URL}/${id}`, application);
  return response.data;
};

export const deleteApplication = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};
