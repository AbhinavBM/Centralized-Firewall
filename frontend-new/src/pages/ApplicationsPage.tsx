import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import ApplicationList from '../components/applications/ApplicationList';

const ApplicationsPage: React.FC = () => {
  return (
    <MainLayout>
      <ApplicationList />
    </MainLayout>
  );
};

export default ApplicationsPage;
