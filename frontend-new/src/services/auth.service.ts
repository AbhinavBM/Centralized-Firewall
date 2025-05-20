import { apiService } from './api';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types/auth.types';

export const authService = {
  login: (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiService.post<AuthResponse>('/auth/login', credentials);
  },

  register: (credentials: RegisterCredentials): Promise<AuthResponse> => {
    return apiService.post<AuthResponse>('/auth/register', credentials);
  },

  getProfile: (): Promise<User> => {
    return apiService.get<User>('/auth/profile');
  },

  logout: (): void => {
    localStorage.removeItem('authToken');
  }
};
