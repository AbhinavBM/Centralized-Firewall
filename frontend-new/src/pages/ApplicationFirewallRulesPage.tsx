import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import ApplicationFirewallRules from '../components/applications/ApplicationFirewallRules';

const ApplicationFirewallRulesPage: React.FC = () => {
  return (
    <MainLayout>
      <ApplicationFirewallRules />
    </MainLayout>
  );
};

export default ApplicationFirewallRulesPage;
