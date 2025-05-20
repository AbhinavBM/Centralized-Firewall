import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import ApplicationForm from '../components/applications/ApplicationForm';

const ApplicationEditPage: React.FC = () => {
  return (
    <MainLayout>
      <ApplicationForm />
    </MainLayout>
  );
};

export default ApplicationEditPage;
