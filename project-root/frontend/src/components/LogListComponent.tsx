import React, { useEffect, useState } from 'react';
import { Log, LogFilters, PaginatedLogs } from '../interfaces/logInterface';
import { getLogs } from '../api/auth/logService';
import LogsTable from './LogsTable';
import Pagination from './Pagination';

interface LogListComponentProps {
  filters: LogFilters;
}

const LogListComponent: React.FC<LogListComponentProps> = ({ filters }) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data: PaginatedLogs = await getLogs(
          currentPage,
          10,
          filters.endpointId,
          filters.appName,
          filters.action,
          filters.protocol,
          filters.startDate,
          filters.endDate
        );
        setLogs(data.logs);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };
    fetchLogs();
  }, [filters, currentPage]);

  return (
    <div>
      <LogsTable logs={logs} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default LogListComponent;
