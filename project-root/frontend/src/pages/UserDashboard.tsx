import React, { useState } from 'react';
import { downloadFromEndpoint } from '../api/auth/endpointService';

const UserDashboard: React.FC = () => {
    const [hostname, setHostname] = useState('');
    const [password, setPassword] = useState('');

    const handleDownload = async () => {
        try {
            const data = await downloadFromEndpoint(hostname, password);
            alert(`Downloaded data: ${JSON.stringify(data)}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>User Dashboard</h1>
            <input
                type="text"
                placeholder="Hostname"
                value={hostname}
                onChange={(e) => setHostname(e.target.value)}
            />
            <input
                type="text"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleDownload}>Download</button>
        </div>
    );
};

export default UserDashboard;
