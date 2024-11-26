import { login, signup, refreshToken } from '../api/auth/authApi';

// Service for login
export const loginService = async (username: string, password: string): Promise<string> => {
    try {
        return await login(username, password);
    } catch (error) {
        throw new Error('Error during login');
    }
};

// Service for signup
export const signupService = async (username: string, password: string): Promise<string> => {
    try {
        return await signup(username, password);
    } catch (error) {
        throw new Error('Error during signup');
    }
};

// Service for refreshing token
export const refreshAuthToken = async (token: string): Promise<string> => {
    try {
        return await refreshToken(token);
    } catch (error) {
        throw new Error('Error refreshing token');
    }
};
