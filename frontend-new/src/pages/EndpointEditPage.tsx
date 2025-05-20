import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import EndpointForm from '../components/endpoints/EndpointForm';

const EndpointEditPage: React.FC = () => {
  return (
    <MainLayout>
      <EndpointForm />
    </MainLayout>
  );
};

export default EndpointEditPage;
