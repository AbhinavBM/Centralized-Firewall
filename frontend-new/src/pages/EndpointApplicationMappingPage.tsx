import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import EndpointApplicationMapping from '../components/mapping/EndpointApplicationMapping';

const EndpointApplicationMappingPage: React.FC = () => {
  return (
    <MainLayout>
      <EndpointApplicationMapping />
    </MainLayout>
  );
};

export default EndpointApplicationMappingPage;
