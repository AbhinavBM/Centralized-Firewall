import React from 'react';
import { Log } from '../interfaces/logInterface';

interface LogsTableProps {
  logs: Log[];
}

const LogsTable: React.FC<LogsTableProps> = ({ logs }) => (
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Endpoint ID</th>
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
      {logs.map((log) => (
        <tr key={log.id}>
          <td>{log.id}</td>
          <td>{log.endpoint_id}</td>
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
);

export default LogsTable;
