import React, { useState, useEffect } from 'react';
import { getAllEndpoints } from '../api/auth/endpointService';  // Import the API function to get endpoints
import { Endpoint } from '../interfaces/endpoint';
import MappingData from '../components/MappingData';  // Import the MappingData component
import ParentComponent from './../components/ParentComponent'; // Import ParentComponent
import MappingForm from './../components/MappingForm'; // Import ParentComponent

const MappingPage: React.FC = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);  // Store endpoints
  const [message, setMessage] = useState<string>('');  // Display message
  const [selectedMapping, setSelectedMapping] = useState<any>(null); // Track the selected mapping

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

  // Handle creating a new mapping or editing an existing one
  const handleMappingSelection = (mapping: any) => {
    setSelectedMapping(mapping); // Set the selected mapping for editing
  };

  return (
    <div>
      <h1>Manage Endpoint Mappings</h1>
      {endpoints.length > 0 ? (
        endpoints.map((endpoint) => (
          <div key={endpoint.id}>
            <h2>Endpoint ID: {endpoint.id}</h2>
            {/* Render the MappingData component for each endpoint */}
            <MappingData endpointId={endpoint.id} onMappingSelect={handleMappingSelection} />
          </div>
        ))
      ) : (
        <p>No endpoints found.</p>
      )}

      {/* Render ParentComponent for managing mappings */}
      <ParentComponent />

      {/* If a mapping is selected, render the MappingForm to edit the mapping */}
      {selectedMapping && (
        <div>
          <h2>Edit Mapping</h2>
          <ParentComponent/>
        </div>
      )}
    </div>
  );
};

export default MappingPage;