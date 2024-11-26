import React, { useState } from 'react';

interface FirewallRuleProps {
  endpointId: string;
}

const FirewallRule: React.FC<FirewallRuleProps> = ({ endpointId }) => {
  const [rule, setRule] = useState<{ protocol: string; action: string }>({ protocol: '', action: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRule((prev) => ({ ...prev, [name]: value }));
  };

  const addRule = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle rule addition logic
  };

  return (
    <div>
      <h2>Firewall Rules</h2>
      <form onSubmit={addRule}>
        <input
          name="protocol"
          value={rule.protocol}
          onChange={handleChange}
          placeholder="Protocol"
        />
        <input
          name="action"
          value={rule.action}
          onChange={handleChange}
          placeholder="Action"
        />
        <button type="submit">Add Rule</button>
      </form>
    </div>
  );
};

export default FirewallRule;
