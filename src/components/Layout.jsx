import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  BarChart3,
  Calendar,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Building2,
  ChevronDown
} from 'lucide-react';

const Layout = () => {
  const { user, logout, theme, toggleTheme, notifications, plants, selectedPlant, setSelectedPlant, sidebarOpen, setSidebarOpen } = useApp();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPlantMenu, setShowPlantMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
  ];

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Compliance Portal
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role === 'corporate' ? 'Corporate Dashboard' : 'Plant Dashboard'}
                </p>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            {/* Plant Selector (for corporate users) */}
            {user?.role === 'corporate' && (
              <div className="relative">
                <button
                  onClick={() => setShowPlantMenu(!showPlantMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Building2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
                    {selectedPlant ? selectedPlant.name : 'All Plants'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showPlantMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <button
                      onClick={() => {
                        setSelectedPlant(null);
                        setShowPlantMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
                    >
                      All Plants
                    </button>
                    {plants.map(plant => (
                      <button
                        key={plant.id}
                        onClick={() => {
                          setSelectedPlant(plant);
                          setShowPlantMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {plant.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {notifications.slice(0, 5).map(notif => (
                      <div
                        key={notif.id}
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          !notif.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {notif.title}
                          </h4>
                          {!notif.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {notif.time}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3 pl-3 border-l border-gray-200 dark:border-gray-700">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.designation}
                </p>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 z-30 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Plant Info (for plant users) */}
        {user?.role === 'plant' && user.plantId && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Your Plant</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {plants.find(p => p.id === user.plantId)?.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {plants.find(p => p.id === user.plantId)?.location}
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : ''}`}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
