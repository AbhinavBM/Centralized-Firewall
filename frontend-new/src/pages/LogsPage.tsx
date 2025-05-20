import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import TrafficLogList from '../components/logs/TrafficLogList';

const LogsPage: React.FC = () => {
  return (
    <MainLayout>
      <TrafficLogList />
    </MainLayout>
  );
};

export default LogsPage;
