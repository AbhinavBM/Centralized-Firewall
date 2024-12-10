import React, { useState } from 'react';
import { LogFilters } from '../interfaces/logInterface';

interface LogFilterProps {
  onFilterChange: (filters: LogFilters) => void;
}

const LogFilter: React.FC<LogFilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<LogFilters>({
    endpointId: '',
    appName: '',
    action: '',
    protocol: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  return (
    <div>
      <input type="text" name="endpointId" placeholder="Endpoint ID" onChange={handleChange} />
      <input type="text" name="appName" placeholder="App Name" onChange={handleChange} />
      <select name="action" onChange={handleChange}>
        <option value="">All Actions</option>
        <option value="ACCEPT">ACCEPT</option>
        <option value="DROP">DROP</option>
      </select>
      <select name="protocol" onChange={handleChange}>
        <option value="">All Protocols</option>
        <option value="TCP">TCP</option>
        <option value="UDP">UDP</option>
      </select>
      <input type="date" name="startDate" onChange={handleChange} />
      <input type="date" name="endDate" onChange={handleChange} />
      <button onClick={applyFilters}>Apply Filters</button>
    </div>
  );
};

export default LogFilter;
