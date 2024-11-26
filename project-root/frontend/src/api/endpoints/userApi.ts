import axios from 'axios';
import { User } from '../../interfaces/user';

const API_URL = 'http://localhost:5000/api/users';

// Fetch all users
export const getUsers = async (): Promise<User[]> => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching users');
    }
};

// Create a new user
export const createUser = async (user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> => {
    try {
        const response = await axios.post(API_URL, user);
        return response.data;
    } catch (error) {
        throw new Error('Error creating user');
    }
};
