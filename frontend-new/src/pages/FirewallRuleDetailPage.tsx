import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import FirewallRuleDetail from '../components/firewall/FirewallRuleDetail';

const FirewallRuleDetailPage: React.FC = () => {
  return (
    <MainLayout>
      <FirewallRuleDetail />
    </MainLayout>
  );
};

export default FirewallRuleDetailPage;
