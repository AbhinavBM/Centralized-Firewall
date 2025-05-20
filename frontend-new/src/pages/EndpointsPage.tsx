import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import EndpointList from '../components/endpoints/EndpointList';

const EndpointsPage: React.FC = () => {
  return (
    <MainLayout>
      <EndpointList />
    </MainLayout>
  );
};

export default EndpointsPage;
