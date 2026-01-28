import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Sun, Moon } from 'lucide-react';
import Lottie from 'lottie-react';
import animation from '../jsonAnimation/log-in-animation.json';
import bexelogo from '../assets/Bexexlogo.png';

const Login = () => {
  const { login, theme, toggleTheme } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!login(username, password)) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-white relative">

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-lg"
      >
        {theme === 'light' ? <Moon /> : <Sun />}
      </button>

      {/* MAIN LAYOUT */}
      <div className="min-h-screen max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-6 py-12">

        {/* LEFT: LOTTIE ANIMATION */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="w-96">
            <Lottie
              animationData={animation}
              loop
              autoplay
            />
          </div>
        </div>

        {/* RIGHT: LOGIN */}
        <div className="max-w-md w-full mx-auto">

          {/* Logo and Title */}
          <div className="text-center mb-8 flex justify-center">
            <img src={bexelogo} alt="" />
          </div>

          {/* Login Card */}
          <div className="border border-black dark:border-black  rounded-2xl p-9">
            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
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
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg"
              >
                Sign In
              </button>

            </form>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Demo Credentials
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span>Corporate Admin:</span>
                <code className="text-indigo-600 font-mono">
                  admin / admin123
                </code>
              </div>

              <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span>Mumbai Plant:</span>
                <code className="text-indigo-600 font-mono">
                  mumbai / mumbai123
                </code>
              </div>

              <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span>Pune Plant:</span>
                <code className="text-indigo-600 font-mono">
                  pune / pune123
                </code>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
            © 2024 Compliance Portal. All rights reserved.
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;
