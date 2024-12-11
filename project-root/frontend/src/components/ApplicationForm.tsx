import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addApplication, editApplication } from '../store/applicationsSlice';
import { AppDispatch } from '../store';
import { useNavigate, useParams } from 'react-router-dom';
import { Application } from '../interfaces/application';
import { RootState } from '../store';
import './styles/ApplicationForm.css';

interface Props {
  application?: Application;
}

const ApplicationForm: React.FC<Props> = ({ application }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const applications = useSelector((state: RootState) => state.applications.applications);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'allowed' | 'blocked' | 'pending' | 'suspended'>('allowed');
  const [policies, setPolicies] = useState<{ name: string; values: string[] }[]>([]);

  // Load existing application data
  useEffect(() => {
    if (id) {
      const existingApp = applications.find((app) => app.id === id);
      if (existingApp) {
        setName(existingApp.name);
        setDescription(existingApp.description);
        setStatus(existingApp.status);

        // Combine default and dynamic policies
        const defaultPolicies = [
          { name: 'Allowed Domains', values: existingApp.allowed_domains || [] },
          { name: 'Allowed IPs', values: existingApp.allowed_ips || [] },
          { name: 'Allowed Protocols', values: existingApp.allowed_protocols || [] },
        ];

        const dynamicPolicies = Object.entries(existingApp.firewall_policies || {}).map(
          ([key, values]) => ({
            name: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), // Snake_case to Title Case
            values,
          })
        );

        setPolicies([...defaultPolicies, ...dynamicPolicies]);
      }
    }
  }, [id, applications]);

  // Add a new policy
  const handleAddPolicy = () => {
    setPolicies([...policies, { name: '', values: [] }]);
  };

  // Update policy name
  const handlePolicyNameChange = (index: number, value: string) => {
    const updatedPolicies = [...policies];
    updatedPolicies[index].name = value;
    setPolicies(updatedPolicies);
  };

  // Update policy rule value
  const handlePolicyValueChange = (policyIndex: number, valueIndex: number, value: string) => {
    const updatedPolicies = [...policies];
    updatedPolicies[policyIndex].values[valueIndex] = value;
    setPolicies(updatedPolicies);
  };

  // Add a rule to a specific policy
  const handleAddRule = (policyIndex: number) => {
    const updatedPolicies = [...policies];
    updatedPolicies[policyIndex].values.push('');
    setPolicies(updatedPolicies);
  };

  // Remove a specific rule from a policy
  const handleRemoveRule = (policyIndex: number, valueIndex: number) => {
    const updatedPolicies = [...policies];
    updatedPolicies[policyIndex].values.splice(valueIndex, 1);
    setPolicies(updatedPolicies);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Extract default policies
    const allowedDomains =
      policies.find((policy) => policy.name === 'Allowed Domains')?.values || [];
    const allowedIPs =
      policies.find((policy) => policy.name === 'Allowed IPs')?.values || [];
    const allowedProtocols =
      policies.find((policy) => policy.name === 'Allowed Protocols')?.values || [];

    // Extract dynamically added policies
    const firewallPolicies = policies.reduce((acc, policy) => {
      if (
        policy.name !== 'Allowed Domains' &&
        policy.name !== 'Allowed IPs' &&
        policy.name !== 'Allowed Protocols'
      ) {
        const key = policy.name
          .toLowerCase()
          .replace(/\s+/g, '_'); // Convert policy name to snake_case
        acc[key] = policy.values.length > 0 ? policy.values : [];
      }
      return acc;
    }, {} as Record<string, string[]>);

    // Construct the application object
    const newApp = {
      name,
      description,
      status,
      allowed_domains: allowedDomains,
      allowed_ips: allowedIPs,
      allowed_protocols: allowedProtocols,
      firewall_policies: firewallPolicies,
    };

    if (application) {
      dispatch(editApplication({ id: application.id, application: newApp }));
    } else {
      dispatch(addApplication(newApp));
    }

    // Reset the form
    setName('');
    setDescription('');
    setStatus('allowed');
    setPolicies([
      { name: 'Allowed Domains', values: [] },
      { name: 'Allowed IPs', values: [] },
      { name: 'Allowed Protocols', values: [] },
    ]);

    // Navigate back to the applications list
    navigate('/applications');
  };

  return (
    <div className="application-form-container">
      <div className="application-form-inner">
        <div className="application-form-box">
          <form onSubmit={handleSubmit} className="application-form">
            <h2>{application ? 'Update Application' : 'Create Application'}</h2>

            {/* Name Field */}
            <div className="form-field">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
              />
            </div>

            {/* Description Field */}
            <div className="form-field">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />
            </div>

            {/* Status Field */}
            <div className="form-field">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <option value="allowed">Allowed</option>
                <option value="blocked">Blocked</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <h3>Policies</h3>
            {policies.map((policy, policyIndex) => (
              <div key={policyIndex} className="policy-field">
                <div className="policy-header">
                  <input
                    type="text"
                    value={policy.name}
                    onChange={(e) => handlePolicyNameChange(policyIndex, e.target.value)}
                    placeholder="Policy Name"
                  />
                  <button type="button" onClick={() => handleAddRule(policyIndex)}>
                    Add Rule
                  </button>
                </div>
                {policy.values.length > 0 && (
                  <div className="policy-values">
                    {policy.values.map((value, valueIndex) => (
                      <div key={valueIndex} className="policy-value">
                        <input
                          type="text"
                          value={value}
                          onChange={(e) =>
                            handlePolicyValueChange(policyIndex, valueIndex, e.target.value)
                          }
                          placeholder="Value"
                        />
                        <button type="button" onClick={() => handleRemoveRule(policyIndex, valueIndex)}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <button type="button" onClick={handleAddPolicy} className="add-policy-button">
              Add Policy
            </button>

            <button type="submit" className="submit-button">
              {application ? 'Update Application' : 'Create Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
