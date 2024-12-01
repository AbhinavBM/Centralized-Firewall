import React from 'react';
import EndpointForm from '../components/EndpointForm';
import EndpointTable from '../components/EndpointTable';

const AdminDashboard: React.FC = () => {
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <EndpointForm />
            <EndpointTable />
        </div>
    );
};

export default AdminDashboard;
