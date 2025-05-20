import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import FirewallRuleForm from '../components/firewall/FirewallRuleForm';

const FirewallRuleCreatePage: React.FC = () => {
  return (
    <MainLayout>
      <FirewallRuleForm />
    </MainLayout>
  );
};

export default FirewallRuleCreatePage;
