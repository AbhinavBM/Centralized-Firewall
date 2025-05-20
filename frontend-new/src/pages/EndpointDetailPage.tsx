import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import EndpointDetail from '../components/endpoints/EndpointDetail';

const EndpointDetailPage: React.FC = () => {
  return (
    <MainLayout>
      <EndpointDetail />
    </MainLayout>
  );
};

export default EndpointDetailPage;
