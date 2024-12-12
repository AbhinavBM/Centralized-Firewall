import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { loadApplications } from '../store/applicationsSlice';
import ApplicationItem from './ApplicationItem';
import { Application } from '../interfaces/application';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ApplicationList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { applications, loading, error } = useSelector((state: RootState) => state.applications);
  const navigate = useNavigate(); // Replace useHistory with useNavigate

  useEffect(() => {
    dispatch(loadApplications());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Applications</h1>
      {applications.map((app: Application) => (
        <ApplicationItem key={app.id} application={app} />
      ))}
    </div>
  );
};

export default ApplicationList;