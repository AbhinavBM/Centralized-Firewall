import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import LogoutButton from './LogoutButton';

// Importing the UserDashboard and AdminDashboard from pages or components
import UserDashboard from '../pages/UserDashboard';
import AdminDashboard from '../pages/AdminDashboard';

const Dashboard: React.FC = () => {
    const { state } = useAuthContext();

    // Check the role of the user and render the corresponding dashboard
    if (!state.user) {
        return <div>Loading...</div>;  // Or show some kind of loading state or redirect to login
    }

    return (
        <div>
            <h1>Welcome, {state.user.username}</h1>
            <p>Role: {state.user.role}</p>

            {state.user.role === 'admin' ? (
                <AdminDashboard />
            ) : (
                <UserDashboard />
            )}

            <LogoutButton />
        </div>
    );
};

export default Dashboard;
