import React from 'react';
import { Application } from '../interfaces/application';

interface Props {
  application: Application;
}

const ApplicationItem: React.FC<Props> = ({ application }) => (
  <div>
    <h3>{application.name}</h3>
    <p>{application.description}</p>
    <p>Status: {application.status}</p>
    <p>Allowed Domains: {application.allowed_domains.join(', ')}</p>
    <p>Allowed IPs: {application.allowed_ips.join(', ')}</p>
    <p>Allowed Protocols: {application.allowed_protocols.join(', ')}</p>
    <pre>Firewall Policies: {JSON.stringify(application.firewall_policies, null, 2)}</pre>
    <p>Created At: {new Date(application.created_at).toLocaleString()}</p>
    <p>Updated At: {new Date(application.updated_at).toLocaleString()}</p>
  </div>
);

export default ApplicationItem;
