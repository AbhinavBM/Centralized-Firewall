import React, { useState, useEffect } from 'react';
import { fetchApplicationsWithEndpoints, fetchEndpoints, createMapping, deleteMapping } from '../api/auth/mappingService';

interface Application {
  id: string;
  name: string;
  endpoints: Endpoint[];
}

interface Endpoint {
  id: string;
  hostname: string;
}

const DisplayAllApplicationsAndEndpoints: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string>('');
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>('');

  // Fetch applications with endpoints and available endpoints on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apps = await fetchApplicationsWithEndpoints();
        setApplications(apps);

        const eps = await fetchEndpoints();
        setEndpoints(eps);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle creating a mapping between an application and an endpoint
  const handleCreateMapping = async () => {
    if (selectedApplicationId && selectedEndpointId) {
      try {
        await createMapping(selectedApplicationId, selectedEndpointId);
        alert('Mapping created successfully!');
        // Refresh the application data after creating the mapping
        const apps = await fetchApplicationsWithEndpoints();
        setApplications(apps);
      } catch (error) {
        console.error('Error creating mapping:', error);
        alert('Error creating mapping!');
      }
    }
  };

  // Handle deleting a mapping
  const handleDeleteMapping = async (mappingId: string) => {
    try {
      await deleteMapping(mappingId);
      alert('Mapping deleted successfully!');
      // Refresh the application data after deleting the mapping
      const apps = await fetchApplicationsWithEndpoints();
      setApplications(apps);
    } catch (error) {
      console.error('Error deleting mapping:', error);
      alert('Error deleting mapping!');
    }
  };

  return (
    <div>
      <h3>Display All Applications and Associated Endpoints</h3>

      {/* Display applications and their associated endpoints */}
      {applications.map((app) => (
        <div key={app.id}>
          <h4>{app.name}</h4>
          <ul>
            {app.endpoints.map((endpoint) => (
              <li key={endpoint.id}>
                {endpoint.hostname}
                <button onClick={() => handleDeleteMapping(endpoint.id)}>Delete Mapping</button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <h3>Create a New Mapping</h3>
      <div>
        <select
          onChange={(e) => setSelectedApplicationId(e.target.value)}
          value={selectedApplicationId}
        >
          <option value="">Select Application</option>
          {applications.map((app) => (
            <option key={app.id} value={app.id}>{app.name}</option>
          ))}
        </select>

        <select
          onChange={(e) => setSelectedEndpointId(e.target.value)}
          value={selectedEndpointId}
        >
          <option value="">Select Endpoint</option>
          {endpoints.map((endpoint) => (
            <option key={endpoint.id} value={endpoint.id}>{endpoint.hostname}</option>
          ))}
        </select>

        <button onClick={handleCreateMapping}>Create Mapping</button>
      </div>
    </div>
  );
};

export default DisplayAllApplicationsAndEndpoints;
