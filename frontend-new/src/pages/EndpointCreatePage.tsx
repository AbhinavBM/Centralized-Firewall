import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import EndpointForm from '../components/endpoints/EndpointForm';

const EndpointCreatePage: React.FC = () => {
  return (
    <MainLayout>
      <EndpointForm />
    </MainLayout>
  );
};

export default EndpointCreatePage;
