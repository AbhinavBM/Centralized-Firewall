import React, { useEffect, useState } from 'react';
import { getUsers } from '../../api/endpoints/userApi';
import { User } from '../../interfaces/user';

const UserList = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const fetchedUsers = await getUsers();
            setUsers(fetchedUsers);
        };
        fetchUsers();
    }, []);

    return (
        <div>
            <h2>User List</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.username} - {user.role}</li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
