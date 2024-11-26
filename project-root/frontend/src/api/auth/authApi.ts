import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const login = async (username: string, password: string): Promise<string> => {
    try {
        const response = await axios.post(`${API_URL}/login`, { username, password });
        return response.data.token;
    } catch (error) {
        throw new Error('Error during login');
    }
};

export const signup = async (username: string, password: string): Promise<string> => {
    try {
        const response = await axios.post(`${API_URL}/signup`, { username, password });
        return response.data.token;
    } catch (error) {
        throw new Error('Error during signup');
    }
};

export const refreshToken = async (token: string): Promise<string> => {
    try {
        const response = await axios.post(`${API_URL}/refresh-token`, { token });
        return response.data.token;
    } catch (error) {
        throw new Error('Error refreshing token');
    }
};
