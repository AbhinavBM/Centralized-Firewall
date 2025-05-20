import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import FirewallRuleList from '../components/firewall/FirewallRuleList';

const FirewallRulesPage: React.FC = () => {
  return (
    <MainLayout>
      <FirewallRuleList />
    </MainLayout>
  );
};

export default FirewallRulesPage;
