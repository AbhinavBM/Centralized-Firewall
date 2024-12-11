import React, { useState } from 'react';
import { createEndpoint } from '../api/auth/endpointService';
import { Endpoint } from '../interfaces/endpoint'; // Import the Endpoint interface
import './styles/EndpointForm.css'; // Import CSS file

const EndpointForm: React.FC = () => {
    const [hostname, setHostname] = useState('');
    const [password, setPassword] = useState('');
    const [os, setOs] = useState<string | null>(''); // New field for OS
    const [ipAddress, setIpAddress] = useState(''); // New field for IP Address
    const [status, setStatus] = useState('offline'); // New field for status
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null); // Reset any previous error

        try {
            // Create the endpoint with the form data
            const endpointData: Endpoint = {
                id: '', // UUID will be assigned by the backend
                hostname,
                os, // Added OS field
                ip_address: ipAddress, // Added IP Address field
                status, // Added status field
                last_sync: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                password, // Optional password field
            };
            
            await createEndpoint(endpointData);
            alert('Endpoint created successfully!');
            setHostname('');
            setPassword('');
            setOs('');
            setIpAddress('');
            setStatus('offline');
        } catch (error: any) {
            console.error('Error creating endpoint:', error);
            setError('Error creating endpoint. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2 style={{ color: 'black' }}>Create Endpoint</h2>
            <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
    <label htmlFor="hostname" style={{ width: '150px' }}>Hostname</label>
    <input
        type="text"
        id="hostname"
        placeholder="Enter hostname"
        value={hostname}
        onChange={(e) => setHostname(e.target.value)}
        required
    />
</div>
<div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
    <label htmlFor="password" style={{ width: '150px' }}>Password</label>
    <input
        type="text"
        id="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
    />
</div>
<div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
    <label htmlFor="os" style={{ width: '150px' }}>Operating System</label>
    <input
        type="text"
        id="os"
        placeholder="Enter operating system"
        value={os || ''}
        onChange={(e) => setOs(e.target.value)}
    />
</div>
<div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
    <label htmlFor="ipAddress" style={{ width: '150px' }}>IP Address</label>
    <input
        type="text"
        id="ipAddress"
        placeholder="Enter IP address"
        value={ipAddress}
        onChange={(e) => setIpAddress(e.target.value)}
    />
</div>
<div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
    <label htmlFor="status" style={{ width: '150px' }}>Status</label>
    <select
        id="status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
    >
        <option value="offline">Offline</option>
        <option value="online">Online</option>
        <option value="maintenance">Maintenance</option>
    </select>
</div>

                {error && <p className="error">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Endpoint'}
                </button>
            </form>
        </div>
    );
};

export default EndpointForm;
