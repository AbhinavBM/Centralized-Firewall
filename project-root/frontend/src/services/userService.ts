import { getUsers, createUser } from '../api/endpoints/userApi';
import { User } from '../interfaces/user'; // Assuming User is defined in the interface

// Service for fetching all users
export const fetchUsers = async (): Promise<User[]> => {
    try {
        return await getUsers();
    } catch (error) {
        throw new Error('Error fetching users');
    }
};

// Service for creating a new user
export const addUser = async (user: User): Promise<User> => {
    try {
        return await createUser(user);
    } catch (error) {
        throw new Error('Error creating user');
    }
};
