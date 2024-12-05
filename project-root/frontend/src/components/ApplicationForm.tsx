import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addApplication, editApplication } from '../store/applicationsSlice';
import { AppDispatch } from '../store';
import { useNavigate, useParams } from 'react-router-dom'; 
import { Application } from '../interfaces/application'; 
import { useSelector } from 'react-redux';
import { RootState } from '../store'; // Ensure RootState is correctly imported

interface Props {
  application?: Application;  // Optional application prop for edit mode
}

const ApplicationForm: React.FC<Props> = ({ application }) => {
  const [name, setName] = useState(application?.name || '');
  const [description, setDescription] = useState(application?.description || '');
  const [status, setStatus] = useState<'allowed' | 'blocked' | 'pending' | 'suspended'>(application?.status || 'allowed');
  const [allowedDomains, setAllowedDomains] = useState<string>(application?.allowed_domains.join(', ') || '');
  const [allowedIPs, setAllowedIPs] = useState<string>(application?.allowed_ips.join(', ') || '');
  const [allowedProtocols, setAllowedProtocols] = useState<string>(application?.allowed_protocols.join(', ') || '');
  const [firewallPolicies, setFirewallPolicies] = useState<string>(JSON.stringify(application?.firewall_policies || {}));

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); 
  const { id } = useParams<{ id: string }>(); 

  // Use the selector to get the applications from the Redux store
  const applications = useSelector((state: RootState) => state.applications.applications);

  useEffect(() => {
    if (id && !application) {
      // Find the application in the store by ID
      const applicationFromStore = applications.find((app) => app.id === id);
      if (applicationFromStore) {
        setName(applicationFromStore.name);
        setDescription(applicationFromStore.description);
        setStatus(applicationFromStore.status);
        setAllowedDomains(applicationFromStore.allowed_domains.join(', '));
        setAllowedIPs(applicationFromStore.allowed_ips.join(', '));
        setAllowedProtocols(applicationFromStore.allowed_protocols.join(', '));
        setFirewallPolicies(JSON.stringify(applicationFromStore.firewall_policies));
      }
    }
  }, [id, application, applications]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newApp = {
      name,
      description,
      status,
      allowed_domains: allowedDomains.split(',').map((domain) => domain.trim()),
      allowed_ips: allowedIPs.split(',').map((ip) => ip.trim()),
      allowed_protocols: allowedProtocols.split(',').map((protocol) => protocol.trim()),
      firewall_policies: firewallPolicies ? JSON.parse(firewallPolicies) : {},
      created_at: application ? application.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
      id: application?.id || Math.random().toString(36).substring(7),
    };

    if (application) {
      dispatch(editApplication({ id: application.id, application: newApp }));
    } else {
      dispatch(addApplication(newApp));
    }

    // Reset form fields
    setName('');
    setDescription('');
    setStatus('allowed');
    setAllowedDomains('');
    setAllowedIPs('');
    setAllowedProtocols('');
    setFirewallPolicies('');

    // Navigate back to the list after submission
    navigate('/applications'); 
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{application ? 'Update Application' : 'Create Application'}</h2>
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
      <button type="submit">{application ? 'Update Application' : 'Create Application'}</button>
    </form>
  );
};

export default ApplicationForm;
