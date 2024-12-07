import React, { useState, useEffect } from 'react';
import { getAllEndpoints } from '../api/auth/endpointService';  // Import the API function to get endpoints
import { Endpoint } from '../interfaces/endpoint';
import MappingData from '../components/MappingData';  // Import the MappingData component

const MappingPage: React.FC = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);  // Store endpoints
  const [message, setMessage] = useState<string>('');  // Display message

  // Fetch all endpoints on component mount
  useEffect(() => {
    const loadEndpoints = async () => {
      try {
        const data = await getAllEndpoints();  // Fetch the endpoints from the API
        setEndpoints(data);  // Set the fetched data to the state
      } catch (error) {
        console.error('Error loading endpoints', error);
      }
    };
    loadEndpoints();  // Call the function to load endpoints
  }, []);

  return (
    <div>
      <h1>Manage Endpoint Mappings</h1>
      {endpoints.length > 0 ? (
        endpoints.map((endpoint) => (
          <div key={endpoint.id}>
            <h2>Endpoint ID: {endpoint.id}</h2>
            {/* <p>Endpoint Name: {endpoint.name}</p> */}
            {/* Render the MappingData component for each endpoint */}
            <MappingData endpointId={endpoint.id} />
          </div>
        ))
      ) : (
        <p>No endpoints found.</p>
      )}
    </div>
  );
};

export default MappingPage;
