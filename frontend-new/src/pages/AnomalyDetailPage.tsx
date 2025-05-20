import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import AnomalyDetail from '../components/anomalies/AnomalyDetail';

const AnomalyDetailPage: React.FC = () => {
  return (
    <MainLayout>
      <AnomalyDetail />
    </MainLayout>
  );
};

export default AnomalyDetailPage;
