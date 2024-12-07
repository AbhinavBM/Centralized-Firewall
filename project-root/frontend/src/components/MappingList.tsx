import React, { useEffect, useState } from 'react';
import { getAllEndpoints } from '../api/auth/endpointService';
import { fetchMappings } from '../api/auth/mappingService';
import { Endpoint } from '../interfaces/endpoint';
import { Mapping } from '../interfaces/mapping';

interface EndpointListProps {
  setEndpoints: React.Dispatch<React.SetStateAction<Endpoint[]>>;
  handleSelectEndpoint: (endpointId: string) => void;
  setMappings: React.Dispatch<React.SetStateAction<Mapping[]>>;
  setSelectedEndpoint: React.Dispatch<React.SetStateAction<Endpoint | null>>;
}

const EndpointList: React.FC<EndpointListProps> = ({
  setEndpoints,
  handleSelectEndpoint,
  setMappings,
  setSelectedEndpoint,
}) => {
  const [endpoints, setLocalEndpoints] = useState<Endpoint[]>([]);  // Local state for endpoints

  // Fetch endpoints from API on component mount
  useEffect(() => {
    const loadEndpoints = async () => {
      try {
        const data = await getAllEndpoints();
        setLocalEndpoints(data);  // Update local state with fetched endpoints
        setEndpoints(data); // Pass data back to parent component (MappingPage)
      } catch (error) {
        console.error('Error loading endpoints', error);
      }
    };
    loadEndpoints();
  }, [setEndpoints]);

  // Fetch mappings for the selected endpoint
  const handleSelect = async (endpointId: string) => {
    try {
      const data = await fetchMappings(endpointId);
      setMappings(data); // Pass the fetched mappings to parent component
      const selectedEndpoint = endpoints.find((endpoint) => endpoint.id === endpointId);
      setSelectedEndpoint(selectedEndpoint || null);
      handleSelectEndpoint(endpointId);  // Call the parent handler
    } catch (error) {
      console.error('Error fetching mappings for endpoint', error);
    }
  };

  return (
    <div>
      <h2>Endpoints</h2>
      <ul>
        {endpoints.map((endpoint) => (
          <li key={endpoint.id} onClick={() => handleSelect(endpoint.id)}>
            {endpoint.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EndpointList;
