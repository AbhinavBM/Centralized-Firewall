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
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        borderBottom: '1px solid #ddd',
        paddingBottom: '8px',
      }}
    >
      <div
        style={{
          width: '180px',
          padding: '12px',
          backgroundColor: '#2c3e50',
          color: '#fff',
          fontWeight: 'bold',
          borderRadius: '6px 0 0 6px',
          textAlign: 'center',
        }}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          padding: '12px',
          backgroundColor: '#f0f4f8',
          color: '#34495e',
          borderRadius: '0 6px 6px 0',
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
        border: '1px solid #d1d9e6',
        borderRadius: '10px',
        padding: '20px',
        margin: '20px auto',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#ffffff',
        maxWidth: '700px',
        textAlign: 'center',
      }}
    >
      <h2 style={{ color: '#2c3e50', marginBottom: '20px', fontWeight: '600' }}>
        {application.name}
      </h2>
      {renderInfoBox('ID', application.id)}
      {renderInfoBox('Status', application.status)}
      {renderInfoBox('Allowed IPs', safeJoin(application.allowed_ips))}
      {application.firewall_policies &&
        Object.keys(application.firewall_policies)
          .filter(
            (policyName) =>
              policyName === 'Source Ports' || policyName === 'Destination Ports'
          )
          .map((policyName) =>
            renderInfoBox(
              policyName
                .replace(/_/g, ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase()),
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
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={handleDelete}
          style={{
            backgroundColor: '#e74c3c',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            marginRight: '10px',
            boxShadow: '0 3px 6px rgba(0, 0, 0, 0.15)',
            fontWeight: 'bold',
          }}
        >
          Delete
        </button>
        <button
          onClick={handleEdit}
          style={{
            backgroundColor: '#27ae60',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            boxShadow: '0 3px 6px rgba(0, 0, 0, 0.15)',
            fontWeight: 'bold',
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default ApplicationItem;
