import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import ApplicationForm from '../components/applications/ApplicationForm';

const ApplicationCreatePage: React.FC = () => {
  return (
    <MainLayout>
      <ApplicationForm />
    </MainLayout>
  );
};

export default ApplicationCreatePage;
