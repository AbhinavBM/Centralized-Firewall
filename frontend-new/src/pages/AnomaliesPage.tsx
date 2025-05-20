import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import AnomalyList from '../components/anomalies/AnomalyList';

const AnomaliesPage: React.FC = () => {
  return (
    <MainLayout>
      <AnomalyList />
    </MainLayout>
  );
};

export default AnomaliesPage;
