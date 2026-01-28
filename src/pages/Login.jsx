import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import Lottie from "lottie-react";
import animation from "../jsonAnimation/log-in-animation.json";
import bexelogo from "../assets/Bexexlogo.png";

const Login = () => {
  const { login } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false); // Night/Day toggle

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!login(username, password)) {
      setError("Invalid username or password");
    }
  };

  const fillCredentials = (user, pass) => {
    setUsername(user);
    setPassword(pass);
    setError("");
  };

  // Toggle function
  const toggleMode = () => setDarkMode((prev) => !prev);

  return (
    <div
      className={`min-h-screen relative flex items-center justify-center overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* ----------------------- */}
      {/* Mode Toggle Button */}
      {/* ----------------------- */}
      <button
        onClick={toggleMode}
        className={`absolute top-6 right-6 px-4 py-2 rounded-full font-medium shadow-md transition-colors duration-300 z-50 ${
          darkMode
            ? "bg-gray-700 text-white"
            : "bg-white text-gray-900 border border-gray-300"
        }`}
      >
        {darkMode ? "Day Mode" : "Night Mode"}
      </button>

      <div className="relative w-full grid grid-cols-1 lg:grid-cols-2 items-center">
        {/* LEFT: LOTTIE */}
        <div
          className={`hidden lg:flex items-center justify-center rounded-lg p-6 transition-colors duration-300 ${
            darkMode
              ? "bg-gray-800"
              : "bg-gradient-to-br from-[#f5f0ff] via-[#e0f7fa] to-[#ffe0f0]"
          }`}
        >
          <div className="w-[800px]">
            <Lottie animationData={animation} loop autoplay />
          </div>
        </div>

        {/* RIGHT: LOGIN */}
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="text-center mb-8 flex justify-center">
            <img src={bexelogo} alt="Bexex" className="w-1/4" />
          </div>

          {/* Login Card */}
          <div
            className={`border rounded-2xl p-9  transition-colors duration-300 ${
              darkMode
                ? "bg-gray-800/90 border-gray-600"
                : "bg-white border-[#181819]"
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors duration-300 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-indigo-400"
                      : "bg-white/60 border-gray-300 text-gray-900 focus:ring-indigo-200"
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none transition-colors duration-300 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-indigo-400"
                      : "bg-white/60 border-gray-300 text-gray-900 focus:ring-indigo-200"
                  }`}
                  required
                />
              </div>

              {error && (
                <div
                  className={`px-4 py-3 rounded-lg text-sm transition-colors duration-300 ${
                    darkMode
                      ? "bg-red-700/30 border border-red-600 text-red-200"
                      : "bg-red-50 border border-red-200 text-red-600"
                  }`}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#181819] hover:bg-[#181819cb] text-white font-semibold py-3 rounded-lg transition"
              >
                Sign In
              </button>
            </form>
          </div>

          {/* Demo Credentials */}
          <div
            className={`mt-6 border rounded-2xl p-4 shadow-md transition-colors duration-300 ${
              darkMode
                ? "bg-gray-700/60 border-gray-600 text-white"
                : "bg-white/80 border-[#181819] text-gray-900"
            }`}
          >
            <h3 className="text-sm font-semibold mb-3">
              Demo Credentials (Click to auto-fill)
            </h3>

            <div className="space-y-2 text-sm">
              <button
                type="button"
                onClick={() => fillCredentials("admin", "admin123")}
                className={`w-full flex justify-between items-center p-2 rounded hover:bg-gray-100 transition ${
                  darkMode ? "hover:bg-gray-600" : ""
                }`}
              >
                <span>Corporate Admin:</span>
                <code className="text-indigo-600 font-mono">
                  admin / admin123
                </code>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials("Compliant", "Compliant123")}
                className={`w-full flex justify-between items-center p-2 rounded hover:bg-gray-100 transition ${
                  darkMode ? "hover:bg-gray-600" : ""
                }`}
              >
                <span>Mumbai Plant:</span>
                <code className="text-indigo-600 font-mono">
                  Compliant / Compliant123
                </code>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials("user", "user123")}
                className={`w-full flex justify-between items-center p-2 rounded hover:bg-gray-100 transition ${
                  darkMode ? "hover:bg-gray-600" : ""
                }`}
              >
                <span>Pune Plant:</span>
                <code className="text-indigo-600 font-mono">
                  user / user123
                </code>
              </button>
            </div>
          </div>

          {/* Footer */}
          <p
            className={`text-center text-sm mt-8 transition-colors duration-300 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            © 2024 Compliance Portal. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
