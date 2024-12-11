import React, { useEffect, useState } from 'react';
import { fetchMappingById } from '../api/auth/mappingService';  // Example API to fetch mappings
import { Mapping } from '../interfaces/Mapping';

interface MappingDataProps {
  endpointId: string;
}

const MappingData: React.FC<MappingDataProps> = ({ endpointId }) => {
  const [mappings, setMappings] = useState<any[]>([]);  // Store mappings for the endpoint (applications)
  const [loading, setLoading] = useState<boolean>(false);  // Handle loading state
  const [error, setError] = useState<string | null>(null);  // Handle error state

  // Fetch mappings for the given endpointId
  useEffect(() => {
    const loadMappings = async () => {
      setLoading(true);
      setError(null); // Reset error state on each load attempt
      try {
        const data = await fetchMappingById(endpointId);  // Fetch mappings for the specific endpoint
        setMappings(data.applications || []);  // Set the fetched applications (assuming the data contains applications)
      } catch (error) {
        setError('Error loading mappings for endpoint');  // Set error message if the API call fails
      } finally {
        setLoading(false);
      }
    };
    if (endpointId) {
      loadMappings();  // Call the function to load mappings when endpointId changes
    }
  }, [endpointId]);

  if (loading) {
    return <p>Loading mappings...</p>;
  }

  return (
    <div>
      <h3>Mappings for Endpoint ID: {endpointId}</h3>
      {error && <p>{error}</p>}
      {mappings.length > 0 ? (
        <ul>
          {mappings.map((application) => (
            <li key={application.id}>
              <p>Application ID: {application.id}</p>
              <p>Application Name: {application.name}</p>
              <p>Description: {application.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No mappings found for this endpoint.</p>
      )}
    </div>
  );
};

export default MappingData;