import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    getApplicationsByEndpoint, 
    getAllApplications, 
    addApplicationToEndpoint, 
    removeApplicationFromEndpoint, 
    updateApplicationStatus, 
    searchApplications 
} from '../api/auth/mappingService';

interface Application {
    id: string;
    name: string;
    description: string;
    status: string;
}

interface Endpoint {
    id: string;
    name: string;
    description: string;
}

interface EndpointApplicationsProps {
    endpointId: string;
}

const EndpointApplications: React.FC<EndpointApplicationsProps> = ({ endpointId }) => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [allApplications, setAllApplications] = useState<Application[]>([]);
    const [endpointInfo, setEndpointInfo] = useState<Endpoint | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedApp, setSelectedApp] = useState<string>('');
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        // Fetch endpoint info, applications, and all available applications
        const fetchData = async () => {
            try {
                // Assuming there's a service to get endpoint details
                const endpointApps = await getApplicationsByEndpoint(endpointId);
                setApplications(endpointApps);
                const apps = await getAllApplications();
                setAllApplications(apps);

                // Simulating an endpoint fetch (replace with an actual API call)
                setEndpointInfo({
                    id: endpointId,
                    name: `Endpoint ${endpointId}`,
                    description: 'Description of the endpoint...',
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [endpointId]);

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        if (e.target.value) {
            const result = await searchApplications(e.target.value);
            setAllApplications(result);
        } else {
            const result = await getAllApplications();
            setAllApplications(result);
        }
    };

    const handleAddApplication = async () => {
        if (!selectedApp) return;
        try {
            await addApplicationToEndpoint(endpointId, selectedApp);
            setApplications([...applications, { id: selectedApp, name: 'New App', description: 'Newly added app', status: 'Allowed' }]);
        } catch (error) {
            console.error('Error adding application:', error);
        }
    };

    const handleRemoveApplication = async (applicationId: string) => {
        try {
            await removeApplicationFromEndpoint(endpointId, applicationId);
            setApplications(applications.filter((app) => app.id !== applicationId));
        } catch (error) {
            console.error('Error removing application:', error);
        }
    };

    const handleStatusChange = async (applicationId: string, status: string) => {
        try {
            await updateApplicationStatus(endpointId, applicationId, status);
            setApplications(
                applications.map((app) =>
                    app.id === applicationId ? { ...app, status } : app
                )
            );
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleViewApplication = (applicationId: string) => {
        // Navigate to the application edit page
        navigate(`/edit-application/${applicationId}`);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
            <h2 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
                Applications Mapped to Endpoint
            </h2>
            {endpointInfo && (
               <div style={{
                marginBottom: '20px',
                padding: '20px',
                backgroundColor: '#f0f4f8',
                border: '1px solid #d1d9e6',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
            }}>
                <h1 style={{
                    margin: '0',
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#2c3e50',
                }}>
                    {endpointInfo.name}
                </h1>
                {/* Uncomment below if you want to add a description */}
                {/* <p style={{
                    marginTop: '10px',
                    fontSize: '16px',
                    color: '#7f8c8d',
                }}>
                    {endpointInfo.description}
                </p> */}
            </div>
            
            )}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search Application"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{ padding: '10px', width: '100%', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <h4>Applications Mapped:</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f1f1f1', borderBottom: '1px solid #ddd' }}>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Application Name</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Remove</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '10px' }}>{app.name}</td>
                                <td style={{ padding: '10px' }}>
                                    <select
                                        value={app.status}
                                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                        style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                                    >
                                        <option value="Allowed">Allowed</option>
                                        <option value="Blocked">Blocked</option>
                                    </select>
                                </td>
                                <td style={{ padding: '10px' }}>
                                    <button 
                                        onClick={() => handleRemoveApplication(app.id)}
                                        style={{ padding: '5px 10px', backgroundColor: '#f44336', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Remove
                                    </button>
                                </td>
                                <td style={{ padding: '10px' }}>
                                    <button 
                                        onClick={() => handleViewApplication(app.id)}
                                        style={{ padding: '5px 10px', backgroundColor: '#2196F3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <h4>Add New Application</h4>
                <select
                    onChange={(e) => setSelectedApp(e.target.value)}
                    value={selectedApp}
                    style={{ padding: '10px', marginRight: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                    <option value="">Select Application</option>
                    {allApplications.map((app) => (
                        <option key={app.id} value={app.id}>
                            {app.name}
                        </option>
                    ))}
                </select>
                <button 
                    onClick={handleAddApplication}
                    style={{ padding: '10px 15px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Add Application
                </button>
            </div>
            <div>
                <button 
                    style={{ padding: '10px 15px', backgroundColor: '#2196F3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default EndpointApplications;
