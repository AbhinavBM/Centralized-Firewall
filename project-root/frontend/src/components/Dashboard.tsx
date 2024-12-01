import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import LogoutButton from './LogoutButton';

// Importing the UserDashboard and AdminDashboard from pages or components
import UserDashboard from '../pages/UserDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import { loginAction } from '../state/actions/authActions'; // Action to log in the user

const Dashboard: React.FC = () => {
    const { state, dispatch } = useAuthContext();
    const [loading, setLoading] = useState(true);

    // Check for token and user info in localStorage on component mount
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');
        console.log(user,token)
        // Assuming user details are stored in localStorage

        if (token && user && !state.user) {
            try {
                // Parse the user data from localStorage
                const parsedUser = JSON.parse(user);

                // Dispatch the login action with user data and token
                dispatch(loginAction(parsedUser, token)); // Pass user data and token to context
            } catch (err) {
                console.error("Error parsing user data from localStorage:", err);
            }
        }
        setLoading(false);
    }, [dispatch, state.user]);

    if (loading) {
        return <div>Loading...</div>;  // Display loading message while checking token or loading user
    }

    if (!state.user) {
        return <div>Please log in to access the dashboard.</div>; // User is not authenticated
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
