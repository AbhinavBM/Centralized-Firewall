import React, { useEffect, useState } from 'react';
import logService, { Log, LogQueryParams } from '../api/auth/logService';

const LogList: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async (params: LogQueryParams) => {
    setLoading(true);
    try {
      const response = await logService.getLogs(params);
      setLogs(response.logs);
    } catch (err) {
      setError('Error fetching logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs({ page: 1, limit: 100 }); // Initial fetch for page 1, 10 logs
  }, []);

  return (
    <div>
      <h2>Log Entries</h2>
      {loading && <p>Loading logs...</p>}
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Source IP</th>
            <th>Destination IP</th>
            <th>Source Port</th>
            <th>Destination Port</th>
            <th>Protocol</th>
            <th>Source Service</th>
            <th>Destination Service</th>
            <th>Domain</th>
            <th>Logged At</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.source_ip}</td>
              <td>{log.destination_ip}</td>
              <td>{log.source_port}</td>
              <td>{log.destination_port}</td>
              <td>{log.protocol}</td>
              <td>{log.source_service || 'N/A'}</td>
              <td>{log.destination_service || 'N/A'}</td>
              <td>{log.domain || 'N/A'}</td>
              <td>{new Date(log.logged_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogList;
