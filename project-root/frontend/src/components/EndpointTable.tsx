import React, { useEffect, useState } from 'react';
import { getAllEndpoints, deleteEndpoint, updateEndpoint } from '../api/auth/endpointService';
import { Endpoint } from '../interfaces/endpoint';
import './styles/EndpointTable.css'; // Import CSS file

const EndpointTable: React.FC = () => {
    const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingDelete, setLoadingDelete] = useState<string | null>(null); // Track loading state for delete
    const [loadingUpdate, setLoadingUpdate] = useState<string | null>(null); // Track loading state for update
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
            setLoadingDelete(id); // Track which endpoint is being deleted
            try {
                await deleteEndpoint(id);
                setEndpoints((prev) => prev.filter((endpoint) => endpoint.id !== id));
            } catch (err) {
                setError('Failed to delete the endpoint');
            } finally {
                setLoadingDelete(null); // Reset loading state
            }
        }
    };

    // Handle update action
    const handleUpdate = async (id: string) => {
        const newHostname = prompt('Enter new hostname:');
        if (newHostname) {
            setLoadingUpdate(id); // Track which endpoint is being updated
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
                setLoadingUpdate(null); // Reset loading state
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
                        <th>IP Address</th>
                        <th>OS</th>
                        <th>Status</th>
                        <th>Last Sync</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {endpoints.length === 0 ? (
                        <tr>
                            <td colSpan={8}>No endpoints found</td>
                        </tr>
                    ) : (
                        endpoints.map((endpoint) => (
                            <tr key={endpoint.id}>
                                <td>{endpoint.hostname}</td>
                                <td>{endpoint.ip_address}</td>
                                <td>{endpoint.os || 'N/A'}</td>
                                <td>{endpoint.status}</td>
                                <td>{new Date(endpoint.last_sync).toLocaleString()}</td>
                                <td>{new Date(endpoint.created_at).toLocaleString()}</td>
                                <td>{new Date(endpoint.updated_at).toLocaleString()}</td>
                                <td>
                                    <button
                                        onClick={() => handleUpdate(endpoint.id)}
                                        disabled={loadingUpdate === endpoint.id || loading}
                                    >
                                        {loadingUpdate === endpoint.id ? 'Updating...' : 'Update'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(endpoint.id)}
                                        disabled={loadingDelete === endpoint.id || loading}
                                    >
                                        {loadingDelete === endpoint.id ? 'Deleting...' : 'Delete'}
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
