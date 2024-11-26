import React, { useState } from 'react';
import { User } from '../../interfaces/user';
import { createUser } from '../../api/endpoints/userApi';

const UserForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'admin' | 'user'>('user');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newUser: User = { id: '', username, password_hash: password, role, created_at: '', updated_at: '' };
        await createUser(newUser);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
            />
            <select value={role} onChange={e => setRole(e.target.value as 'admin' | 'user')}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            <button type="submit">Submit</button>
        </form>
    );
};

export default UserForm;
