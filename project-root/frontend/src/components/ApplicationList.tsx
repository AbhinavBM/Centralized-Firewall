import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';  // Import AppDispatch
import { loadApplications } from '../store/applicationsSlice';
import ApplicationItem from './ApplicationItem';
import { Application } from '../interfaces/application'; // Ensure correct import for the Application type

const ApplicationList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();  // Type dispatch correctly
  const { applications, loading, error } = useSelector((state: RootState) => state.applications);

  useEffect(() => {
    dispatch(loadApplications());  // Dispatch the async thunk action
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
