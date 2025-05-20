import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import FirewallRuleForm from '../components/firewall/FirewallRuleForm';

const FirewallRuleEditPage: React.FC = () => {
  return (
    <MainLayout>
      <FirewallRuleForm />
    </MainLayout>
  );
};

export default FirewallRuleEditPage;
