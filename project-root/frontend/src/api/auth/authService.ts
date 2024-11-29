import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

export const signup = async (username: string, password: string, role: string) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, { username, password, role });
        return response.data; // Contains token and user data
    } catch (error) {
        throw error.response ? error.response.data : new Error('Server error');
    }
};

export const login = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { username, password });
        return response.data; // Contains token and user data
    } catch (error) {
        throw error.response ? error.response.data : new Error('Server error');
    }
};
