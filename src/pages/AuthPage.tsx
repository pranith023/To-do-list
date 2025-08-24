import React, { useState } from 'react';
import { AuthForm } from '../components/Auth/AuthForm';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        {isLogin ? (
          <Login onToggleMode={() => setIsLogin(false)} />
        ) : (
          <Register onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};