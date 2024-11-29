import React from 'react';
import { useAuthContext } from '../context/AuthContext';

const Dashboard: React.FC = () => {
    const { state, dispatch } = useAuthContext();

    return (
        <div>
            <h1>Welcome, {state.user?.username}</h1>
            <button onClick={() => dispatch({ type: 'LOGOUT' })}>Log Out</button>
        </div>
    );
};

export default Dashboard;
