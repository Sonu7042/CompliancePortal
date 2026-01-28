import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Sun, Moon } from 'lucide-react';

const Login = () => {
  const { login, theme, toggleTheme } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (login(username, password)) {
      // Login successful - handled by context
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-2xl mb-4 shadow-xl">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Compliance Portal
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Legal Compliance Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Demo Credentials
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="text-gray-600 dark:text-gray-400">Corporate Admin:</span>
              <code className="text-indigo-600 dark:text-indigo-400 font-mono">admin / admin123</code>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="text-gray-600 dark:text-gray-400">Mumbai Plant:</span>
              <code className="text-indigo-600 dark:text-indigo-400 font-mono">mumbai / mumbai123</code>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="text-gray-600 dark:text-gray-400">Pune Plant:</span>
              <code className="text-indigo-600 dark:text-indigo-400 font-mono">pune / pune123</code>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          © 2024 Compliance Portal. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
