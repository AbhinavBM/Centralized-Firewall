import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import ApplicationDetail from '../components/applications/ApplicationDetail';

const ApplicationDetailPage: React.FC = () => {
  return (
    <MainLayout>
      <ApplicationDetail />
    </MainLayout>
  );
};

export default ApplicationDetailPage;
