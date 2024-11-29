import React, { useState } from 'react';
import { signup, login } from '../api/auth/authService';
import { useAuthContext } from '../context/AuthContext';
import { loginAction } from '../state/actions/authActions';
import { Link, useNavigate } from 'react-router-dom';
import './styles/AuthForm.css';

interface AuthFormProps {
    isSignup?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ isSignup }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (isSignup && password !== confirmPassword) {
            setError("Passwords don't match!");
            setIsLoading(false);
            return;
        }

        try {
            const user = isSignup
                ? await signup(username, password, role)
                : await login(username, password);
            dispatch(loginAction(user));
            navigate('/dashboard');
        } catch (err) {
            setError('Authentication failed. Please check your credentials and try again.');
            console.error('Error during authentication:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-form-container">
            <h2 className="auth-form-title">{isSignup ? 'Sign Up' : 'Log In'}</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="auth-form-input">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="auth-form-input">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {isSignup && (
                    <>
                        <div className="auth-form-input">
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="auth-form-input">
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </>
                )}

                {error && <div className="auth-form-error">{error}</div>}

                <button
                    type="submit"
                    className={`auth-form-button ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Processing...' : isSignup ? 'Sign Up' : 'Log In'}
                </button>
            </form>

            <div className="auth-form-toggle">
                {isSignup ? (
                    <>
                        <p>Already have an account?</p>
                        <Link to="/" className="auth-form-link">Log In</Link>
                    </>
                ) : (
                    <>
                        <p>Don't have an account?</p>
                        <Link to="/signup" className="auth-form-link">Sign Up</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthForm;
