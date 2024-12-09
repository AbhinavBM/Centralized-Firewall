// LogList.tsx
import React from 'react';
import { Log } from '../interfaces/logInterface';

// Function to group logs by endpoint_id
const groupLogsByEndpoint = (logs: Log[]) => {
  return logs.reduce((groups: { [key: string]: Log[] }, log) => {
    if (!groups[log.endpoint_id]) {
      groups[log.endpoint_id] = [];
    }
    groups[log.endpoint_id].push(log);
    return groups;
  }, {});
};

interface LogListProps {
  logs: Log[];
}

const LogList: React.FC<LogListProps> = ({ logs }) => {
  // Group logs by endpoint_id
  const groupedLogs = groupLogsByEndpoint(logs);

  return (
    <div>
      <h2>Logs Grouped by Endpoint ID</h2>
      {Object.keys(groupedLogs).map((endpointId) => (
        <div key={endpointId}>
          <h3>Endpoint ID: {endpointId}</h3>
          <table>
            <thead>
              <tr>
                <th>Source IP</th>
                <th>Destination IP</th>
                <th>Source Port</th>
                <th>Destination Port</th>
                <th>Protocol</th>
                <th>Action</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {groupedLogs[endpointId].map((log) => (
                <tr key={log.id}>
                  <td>{log.source_ip}</td>
                  <td>{log.destination_ip}</td>
                  <td>{log.source_port}</td>
                  <td>{log.destination_port}</td>
                  <td>{log.protocol}</td>
                  <td>{log.action}</td>
                  <td>{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default LogList;
