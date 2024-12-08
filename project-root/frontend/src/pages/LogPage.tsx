// LogPage.tsx
import React, { useEffect, useState } from 'react';
import { getLogs, searchLogs } from '../api/auth/logService';
import { Log, LogResponse } from '../interfaces/log';
import LogList from '../components/LogList';
import LogSearch from '../components/LogSearch';

const LogPage: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const logResponse: LogResponse = await getLogs(1, 10); // Default page 1, limit 10
      setLogs(logResponse.logs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const logResponse: LogResponse = await searchLogs(query);
      setLogs(logResponse.logs);
    } catch (error) {
      console.error('Error searching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Log Management</h1>
      <LogSearch onSearch={handleSearch} />
      {loading ? <p>Loading...</p> : <LogList logs={logs} />}
    </div>
  );
};

export default LogPage;
