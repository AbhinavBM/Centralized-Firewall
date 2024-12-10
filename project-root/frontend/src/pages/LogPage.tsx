import React, { useState } from 'react';
import LogFilter from '../components/LogFilter';
import LogListComponent from '../components/LogListComponent';
import { LogFilters } from '../interfaces/logInterface';

const LogPage: React.FC = () => {
  const [filters, setFilters] = useState<LogFilters>({});

  return (
    <div>
      <h1>Log Management</h1>
      <LogFilter onFilterChange={setFilters} />
      <LogListComponent filters={filters} />
    </div>
  );
};

export default LogPage;
