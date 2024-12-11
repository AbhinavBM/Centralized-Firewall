import React from 'react';
import { Application } from '../interfaces/application';
import { useDispatch } from 'react-redux';
import { removeApplication } from '../store/applicationsSlice';
import { useNavigate } from 'react-router-dom';

interface Props {
  application: Application;
}

const ApplicationItem: React.FC<Props> = ({ application }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = () => {
    dispatch(removeApplication(application.id));
  };

  const handleEdit = () => {
    navigate(`/edit-application/${application.id}`);
  };

  const safeJoin = (arr: string[] | undefined | null) => {
    return arr && Array.isArray(arr) ? arr.join(', ') : 'No data available';
  };

  const renderInfoBox = (label: string, value: string | undefined) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '12px',
        borderBottom: '1px solid #ddd',
        paddingBottom: '8px',
      }}
    >
      <div
        style={{
          width: '150px',
          padding: '8px',
          backgroundColor: '#333',
          color: '#fff',
          fontWeight: 'bold',
          borderRadius: '4px 0 0 4px',
          textAlign: 'center',
        }}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          padding: '8px',
          backgroundColor: '#f5f5f5',
          color: '#000',
          borderRadius: '0 4px 4px 0',
          textAlign: 'center',
        }}
      >
        {value}
      </div>
    </div>
  );

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        margin: '16px auto', // Center horizontally
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
        maxWidth: '600px', // Center constraint for better design
        textAlign: 'center',
      }}
    >
      <h2 style={{ color: '#333', marginBottom: '16px' }}>{application.name}</h2>
      {renderInfoBox('Description', application.description)}
      {renderInfoBox('Status', application.status)}
      {renderInfoBox('Allowed Domains', safeJoin(application.allowed_domains))}
      {renderInfoBox('Allowed IPs', safeJoin(application.allowed_ips))}
      {renderInfoBox('Allowed Protocols', safeJoin(application.allowed_protocols))}
      {application.firewall_policies &&
        Object.keys(application.firewall_policies).map((policyName) =>
          renderInfoBox(
            policyName.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            Array.isArray(application.firewall_policies[policyName])
              ? application.firewall_policies[policyName].join(', ')
              : 'No values'
          )
        )}
      {renderInfoBox(
        'Created At',
        new Date(application.created_at).toLocaleString()
      )}
      {renderInfoBox(
        'Updated At',
        new Date(application.updated_at).toLocaleString()
      )}
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <button
          onClick={handleDelete}
          style={{
            backgroundColor: '#ff4d4d',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        >
          Delete
        </button>
        <button
          onClick={handleEdit}
          style={{
            backgroundColor: '#4caf50',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default ApplicationItem;
