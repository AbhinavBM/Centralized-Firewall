import React from 'react';
import ApplicationForm from '../components/ApplicationForm';
import ApplicationList from '../components/ApplicationList';

const ApplicationsPage: React.FC = () => (
  <div>
    <ApplicationForm />
    <hr />
    <ApplicationList />
  </div>
);

export default ApplicationsPage;
