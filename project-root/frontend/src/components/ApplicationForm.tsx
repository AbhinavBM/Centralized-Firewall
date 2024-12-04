import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addApplication } from '../store/applicationsSlice';

const ApplicationForm: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'allowed' | 'blocked' | 'pending' | 'suspended'>('allowed');
  const [allowedDomains, setAllowedDomains] = useState<string>('');
  const [allowedIPs, setAllowedIPs] = useState<string>('');
  const [allowedProtocols, setAllowedProtocols] = useState<string>('');
  const [firewallPolicies, setFirewallPolicies] = useState<string>('');
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(
      addApplication({
        name,
        description,
        status,
        allowed_domains: allowedDomains.split(',').map((domain) => domain.trim()),
        allowed_ips: allowedIPs.split(',').map((ip) => ip.trim()),
        allowed_protocols: allowedProtocols.split(',').map((protocol) => protocol.trim()),
        firewall_policies: JSON.parse(firewallPolicies || '{}'),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        id: Math.random().toString(36).substring(7), // Temporary ID
      })
    );

    setName('');
    setDescription('');
    setStatus('allowed');
    setAllowedDomains('');
    setAllowedIPs('');
    setAllowedProtocols('');
    setFirewallPolicies('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Application</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
        <option value="allowed">Allowed</option>
        <option value="blocked">Blocked</option>
        <option value="pending">Pending</option>
        <option value="suspended">Suspended</option>
      </select>
      <input
        type="text"
        value={allowedDomains}
        onChange={(e) => setAllowedDomains(e.target.value)}
        placeholder="Allowed Domains (comma-separated)"
      />
      <input
        type="text"
        value={allowedIPs}
        onChange={(e) => setAllowedIPs(e.target.value)}
        placeholder="Allowed IPs (comma-separated)"
      />
      <input
        type="text"
        value={allowedProtocols}
        onChange={(e) => setAllowedProtocols(e.target.value)}
        placeholder="Allowed Protocols (comma-separated)"
      />
      <textarea
        value={firewallPolicies}
        onChange={(e) => setFirewallPolicies(e.target.value)}
        placeholder="Firewall Policies (JSON format)"
      />
      <button type="submit">Create Application</button>
    </form>
  );
};

export default ApplicationForm;
