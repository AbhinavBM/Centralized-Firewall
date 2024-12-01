import React, { useEffect, useState } from 'react';
import { getAllEndpoints, deleteEndpoint, updateEndpoint } from '../api/auth/endpointService';
import { Endpoint } from '../interfaces/endpoint';
import './styles/endpointStyles.css'; // Import CSS file

const EndpointTable: React.FC = () => {
    const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch endpoints on mount
    useEffect(() => {
        const fetchEndpoints = async () => {
            setLoading(true);
            setError(null); // Reset error
            try {
                const data = await getAllEndpoints();
                setEndpoints(data);
            } catch (err) {
                setError('Failed to fetch endpoints');
            } finally {
                setLoading(false);
            }
        };
        
        fetchEndpoints();
    }, []);

    // Handle delete action
    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this endpoint?')) {
            setLoading(true);
            try {
                await deleteEndpoint(id);
                setEndpoints((prev) => prev.filter((endpoint) => endpoint.id !== id));
            } catch (err) {
                setError('Failed to delete the endpoint');
            } finally {
                setLoading(false);
            }
        }
    };

    // Handle update action
    const handleUpdate = async (id: string) => {
        const newHostname = prompt('Enter new hostname:');
        if (newHostname) {
            setLoading(true);
            try {
                await updateEndpoint(id, { hostname: newHostname });
                setEndpoints((prev) =>
                    prev.map((endpoint) =>
                        endpoint.id === id ? { ...endpoint, hostname: newHostname } : endpoint
                    )
                );
            } catch (err) {
                setError('Failed to update the endpoint');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="container">
            <h2>Endpoint List</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Hostname</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {endpoints.length === 0 ? (
                        <tr>
                            <td colSpan={3}>No endpoints found</td>
                        </tr>
                    ) : (
                        endpoints.map((endpoint) => (
                            <tr key={endpoint.id}>
                                <td>{endpoint.hostname}</td>
                                <td>{endpoint.status}</td>
                                <td>
                                    <button onClick={() => handleUpdate(endpoint.id)} disabled={loading}>
                                        {loading ? 'Updating...' : 'Update'}
                                    </button>
                                    <button onClick={() => handleDelete(endpoint.id)} disabled={loading}>
                                        {loading ? 'Deleting...' : 'Delete'}
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default EndpointTable;
