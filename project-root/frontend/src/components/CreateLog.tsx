import React, { useState } from 'react';
import logService from '../api/auth/logService';

const CreateLog: React.FC = () => {
  const [formData, setFormData] = useState({
    source_ip: '',
    destination_ip: '',
    source_port: '',
    destination_port: '',
    protocol: '',
    source_service: '',
    destination_service: '',
    domain: '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await logService.createLog(formData);
      alert('Log entry created successfully!');
      setFormData({
        source_ip: '',
        destination_ip: '',
        source_port: '',
        destination_port: '',
        protocol: '',
        source_service: '',
        destination_service: '',
        domain: '',
      });
    } catch (err) {
      setError('Error creating log entry');
    }
  };

  return (
    <div>
      <h2>Create New Log</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="source_ip" value={formData.source_ip} onChange={handleChange} placeholder="Source IP" required />
        <input type="text" name="destination_ip" value={formData.destination_ip} onChange={handleChange} placeholder="Destination IP" required />
        <input type="number" name="source_port" value={formData.source_port} onChange={handleChange} placeholder="Source Port" required />
        <input type="number" name="destination_port" value={formData.destination_port} onChange={handleChange} placeholder="Destination Port" required />
        <input type="text" name="protocol" value={formData.protocol} onChange={handleChange} placeholder="Protocol" required />
        <input type="text" name="source_service" value={formData.source_service} onChange={handleChange} placeholder="Source Service" />
        <input type="text" name="destination_service" value={formData.destination_service} onChange={handleChange} placeholder="Destination Service" />
        <input type="text" name="domain" value={formData.domain} onChange={handleChange} placeholder="Domain" />
        <button type="submit">Create Log</button>
      </form>
    </div>
  );
};

export default CreateLog;
