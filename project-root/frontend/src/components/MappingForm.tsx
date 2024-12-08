import React, { useEffect, useState } from 'react';
import { getAllEndpoints } from '../api/auth/endpointService';
import { fetchApplications } from '../api/auth/applicationsService';

interface MappingFormProps {
  handleCreateMapping: (endpointId: string, applicationId: string) => void;
  handleUpdateMapping: (id: string, endpointId: string, applicationId: string, status: string) => void;
  selectedMapping: any;
  setSelectedMapping: (mapping: any) => void;
  message: string;
}

const MappingForm: React.FC<MappingFormProps> = ({
  handleCreateMapping,
  handleUpdateMapping,
  selectedMapping,
  setSelectedMapping,
  message,
}) => {
  const [endpoints, setEndpoints] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('');
  const [selectedApplication, setSelectedApplication] = useState<string>('');
  const [status, setStatus] = useState<string>('active');

  useEffect(() => {
    const loadEndpoints = async () => {
      const endpointData = await getAllEndpoints();
      setEndpoints(endpointData);
    };

    const loadApplications = async () => {
      const applicationData = await fetchApplications();
      setApplications(applicationData);
    };

    loadEndpoints();
    loadApplications();

    if (selectedMapping) {
      setSelectedEndpoint(selectedMapping.endpoint_id);
      setSelectedApplication(selectedMapping.application_id);
      setStatus(selectedMapping.status);
    }
  }, [selectedMapping]);

  const handleSubmit = async () => {
    if (!selectedEndpoint || !selectedApplication) {
      alert('Please select both an endpoint and an application.');
      return;
    }

    if (selectedMapping) {
      await handleUpdateMapping(selectedMapping.id, selectedEndpoint, selectedApplication, status);
    } else {
      await handleCreateMapping(selectedEndpoint, selectedApplication);
    }
  };

  return (
    <div>
      <h2>{selectedMapping ? 'Edit Mapping' : 'Create Mapping'}</h2>
      <div>
        <label>Endpoint: </label>
        <select value={selectedEndpoint} onChange={(e) => setSelectedEndpoint(e.target.value)}>
          <option value="">Select Endpoint</option>
          {endpoints.map((endpoint) => (
            <option key={endpoint.id} value={endpoint.id}>
              {endpoint.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Application: </label>
        <select value={selectedApplication} onChange={(e) => setSelectedApplication(e.target.value)}>
          <option value="">Select Application</option>
          {applications.map((application) => (
            <option key={application.id} value={application.id}>
              {application.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Status: </label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <button onClick={handleSubmit}>
        {selectedMapping ? 'Update Mapping' : 'Add Mapping'}
      </button>
      {selectedMapping && <button onClick={() => setSelectedMapping(null)}>Cancel</button>}
      <p>{message}</p>
    </div>
  );
};

export default MappingForm;
