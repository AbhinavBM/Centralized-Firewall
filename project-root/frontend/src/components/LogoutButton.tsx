import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import { logoutAction } from '../state/actions/authActions';
import { logout } from '../api/auth/authService';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        dispatch(logoutAction());
        navigate('/');
    };

    return <button onClick={handleLogout}>Log Out</button>;
};

export default LogoutButton;
