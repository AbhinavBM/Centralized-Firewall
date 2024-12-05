import React from 'react';
import { Application } from '../interfaces/application';
import { useDispatch } from 'react-redux';
import { removeApplication } from '../store/applicationsSlice';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

interface Props {
  application: Application;
}

const ApplicationItem: React.FC<Props> = ({ application }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // To handle navigation

  const handleDelete = () => {
    dispatch(removeApplication(application.id));
  };

  const handleEdit = () => {
    // Navigate to the edit page with the application's ID
    navigate(`/edit-application/${application.id}`);
  };

  const safeJoin = (arr: string[] | undefined | null) => {
    return arr && Array.isArray(arr) ? arr.join(', ') : 'No data available';
  };

  return (
    <div>
      <h3>{application.name}</h3>
      <p>{application.description}</p>
      <p>Status: {application.status}</p>
      <p>Allowed Domains: {safeJoin(application.allowed_domains)}</p>
      <p>Allowed IPs: {safeJoin(application.allowed_ips)}</p>
      <p>Allowed Protocols: {safeJoin(application.allowed_protocols)}</p>
      <pre>Firewall Policies: {JSON.stringify(application.firewall_policies, null, 2)}</pre>
      <p>Created At: {new Date(application.created_at).toLocaleString()}</p>
      <p>Updated At: {new Date(application.updated_at).toLocaleString()}</p>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={handleEdit}>Edit</button> {/* Edit Button */}
    </div>
  );
};

export default ApplicationItem;
