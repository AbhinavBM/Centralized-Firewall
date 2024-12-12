import React, { useState } from 'react';
import LogList from '../components/LogList';
// import CreateLog from '../components/CreateLog';

const LogPage: React.FC = () => {

  return (
    <div>
    <h1>Log Management</h1>
    <LogList />
  </div>

  );
};

export default LogPage;
