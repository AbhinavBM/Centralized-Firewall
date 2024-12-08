import React, { useState } from 'react';
import MappingForm from './MappingForm';
import { createMapping, updateMapping } from '../api/auth/mappingService';
import { Mapping } from '../interfaces/Mapping';

const ParentComponent: React.FC = () => {
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [selectedMapping, setSelectedMapping] = useState<any>(null);
  const [message, setMessage] = useState('');

  const handleCreateMapping = async (endpointId: string, applicationId: string) => {
    try {
      const newMapping = await createMapping(endpointId, applicationId);
      setMappings([...mappings, newMapping]);
      setMessage('Mapping created successfully.');
    } catch (error) {
      setMessage(error.message || 'Failed to create mapping.');
    }
  };

  const handleUpdateMapping = async (id: string, endpointId: string, applicationId: string, status: string) => {
    try {
      const updatedMapping = await updateMapping(id, endpointId, applicationId, status);
      setMappings(mappings.map((m) => (m.id === id ? updatedMapping : m)));
      setMessage('Mapping updated successfully.');
    } catch (error) {
      setMessage(error.message || 'Failed to update mapping.');
    }
  };

  return (
    <div>
      <MappingForm
        handleCreateMapping={handleCreateMapping}
        handleUpdateMapping={handleUpdateMapping}
        selectedMapping={selectedMapping}
        setSelectedMapping={setSelectedMapping}
        message={message}
      />
      <div>
        <h3>Current Mappings</h3>
        <ul>
          {mappings.map((mapping) => (
            <li key={mapping.id}>
              {mapping.endpoint_id} - {mapping.application_id} - {mapping.status}
              <button onClick={() => setSelectedMapping(mapping)}>Edit</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ParentComponent;
