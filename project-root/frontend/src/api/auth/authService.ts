import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

export const signup = async (username: string, password: string, role: string) => {
    console.log(username, role); // For debugging purposes
    const response = await axios.post(`${API_URL}/signup`, { username, password, role });
    console.log(response.data)

    return response.data;
};

export const login = async (username: string, password: string, role: string) => {
    console.log(username, role); // For debugging purposes
    const response = await axios.post(`${API_URL}/login`, { username, password, role });
    console.log(response.data)
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('authToken');
};
