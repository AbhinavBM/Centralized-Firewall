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
  const { id } = useParams<{ id: string }>(); // id should be UUID type
  const applications = useSelector((state: RootState) => state.applications.applications);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'allowed' | 'blocked' | 'pending' | 'suspended'>('allowed');
  const [policies, setPolicies] = useState<{ name: string; values: string[] }[]>([]);

  // Load existing application data and create mutable copies
  useEffect(() => {
    if (id && !application) {
      const existingApp = applications.find((app) => app.id === id);
      if (existingApp) {
        // Create mutable copies of the data
        setName(existingApp.name);
        setDescription(existingApp.description);
        setStatus(existingApp.status);

        // Combine default and dynamic policies
        const defaultPolicies = [
          { name: 'Allowed Domains', values: existingApp.allowed_domains || [] },
          { name: 'Allowed IPs', values: existingApp.allowed_ips || [] },
        ];

        const dynamicPolicies = Object.entries(existingApp.firewall_policies || {}).map(
          ([key, values]) => ({
            name: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), // Snake_case to Title Case
            values,
          })
        );

        setPolicies([...defaultPolicies, ...dynamicPolicies]);
      }
    } else if (application) {
      // If an application prop is passed, create mutable copies of it
      setName(application.name);
      setDescription(application.description);
      setStatus(application.status);
      setPolicies([
        { name: 'Allowed Domains', values: application.allowed_domains || [] },
        { name: 'Allowed IPs', values: application.allowed_ips || [] },
        ...Object.entries(application.firewall_policies || {}).map(([key, values]) => ({
          name: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          values,
        })),
      ]);
    }
  }, [id, applications, application]);

  // Add a new policy
  const handleAddPolicy = () => {
    setPolicies((prevPolicies) => [...prevPolicies, { name: '', values: [] }]);
  };

  // Update policy name
  const handlePolicyNameChange = (index: number, value: string) => {
    setPolicies((prevPolicies) => {
      const updatedPolicies = prevPolicies.map((policy, i) =>
        i === index ? { ...policy, name: value } : policy
      );
      return updatedPolicies;
    });
  };

  // Update policy rule value
  const handlePolicyValueChange = (policyIndex: number, valueIndex: number, value: string) => {
    setPolicies((prevPolicies) => {
      const updatedPolicies = prevPolicies.map((policy, index) => {
        if (index === policyIndex) {
          const updatedValues = policy.values.map((val, i) => (i === valueIndex ? value : val));
          return { ...policy, values: updatedValues };
        }
        return policy;
      });
      return updatedPolicies;
    });
  };

  // Add a rule to a specific policy
  const handleAddRule = (policyIndex: number) => {
    setPolicies((prevPolicies) => {
      const updatedPolicies = prevPolicies.map((policy, index) => {
        if (index === policyIndex) {
          return { ...policy, values: [...policy.values, ''] }; // Add new rule
        }
        return policy;
      });
      return updatedPolicies;
    });
  };

  // Remove a specific rule from a policy
  const handleRemoveRule = (policyIndex: number, valueIndex: number) => {
    setPolicies((prevPolicies) => {
      const updatedPolicies = prevPolicies.map((policy, index) => {
        if (index === policyIndex) {
          const updatedValues = policy.values.filter((_, i) => i !== valueIndex);
          return { ...policy, values: updatedValues };
        }
        return policy;
      });
      return updatedPolicies;
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Extract default policies
    const allowedDomains =
      policies.find((policy) => policy.name === 'Allowed Domains')?.values || [];
    const allowedIPs =
      policies.find((policy) => policy.name === 'Allowed IPs')?.values || [];

    // Extract dynamically added policies
    const firewallPolicies = policies.reduce((acc, policy) => {
      if (
        policy.name !== 'Allowed Domains' &&
        policy.name !== 'Allowed IPs'
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
      firewall_policies: firewallPolicies,
    };

    if (id && !application) {
      // Edit existing application
      dispatch(editApplication({ id, application: newApp }));
    } else {
      // Add a new application
      dispatch(addApplication(newApp));
    }

    // Reset the form
    setName('');
    setDescription('');
    setStatus('allowed');
    setPolicies([{ name: 'Allowed Domains', values: [] }, { name: 'Allowed IPs', values: [] }]);

    // Navigate back to the applications list
    navigate('/applications');
  };

  return (
    <div className="application-form-container">
      <div className="application-form-inner">
        <div className="application-form-box">
          <form onSubmit={handleSubmit} className="application-form">
            <h2>{application ? 'Update Application-Rule' : 'Create Application-Rule'}</h2>

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
                value={description || ''}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />
            </div>

            {/* Status Field */}
            <div className="form-field">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'allowed' | 'blocked' | 'pending' | 'suspended')}
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
              {application ? 'Update Application-Rule' : 'Create Application-Rule'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
