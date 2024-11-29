import React from 'react';
import AuthForm from '../components/AuthForm';

const SignupPage: React.FC = () => {
    return <AuthForm isSignup={true} />;
};

export default SignupPage;
