import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import logo from "../assets/Bexexlogo.png";
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  BarChart3,
  Calendar,
  Bell,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Building2,
  ChevronDown,
} from "lucide-react";

const Layout = () => {
  const {
    user,
    logout,
    theme,
    toggleTheme,
    notifications,
    plants,
    selectedPlant,
    setSelectedPlant,
    sidebarOpen,
    setSidebarOpen,
  } = useApp();

  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPlantMenu, setShowPlantMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Documents", href: "/documents", icon: FileText },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    { name: "Calendar", href: "/calendar", icon: Calendar },
  ];

  const isActive = (href) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] dark:bg-[#0f0f0f]">
      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 h-16 z-50  dark:bg-[#0f0f0f]  ">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {sidebarOpen ? <X /> : <Menu />}
            </button>

            <div className="flex items-center gap-3">
              <div className="w-16 h-16  flex items-center justify-center">
                {/* <Building2 className="text-white" /> */}
                <img src={logo} alt="" />
              </div>
              {/* <h1 className="text-lg font-bold hidden md:block text-gray-900 dark:text-white">
                Compliance Portal
              </h1> */}
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Plant Selector */}
            {user?.role === "corporate" && (
              <div className="relative">
                <button
                  onClick={() => setShowPlantMenu(!showPlantMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Building2 size={16} />
                  <span className="hidden md:block text-sm">
                    {selectedPlant ? selectedPlant.name : "All Plants"}
                  </span>
                  <ChevronDown size={16} />
                </button>

                {showPlantMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl  border dark:border-gray-800 z-50">
                    <button
                      onClick={() => {
                        setSelectedPlant(null);
                        setShowPlantMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      All Plants
                    </button>

                    {plants.map((plant) => (
                      <button
                        key={plant.id}
                        onClick={() => {
                          setSelectedPlant(plant);
                          setShowPlantMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        {plant.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Theme */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === "light" ? <Moon /> : <Sun />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative"
              >
                <Bell />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-gray-600 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl  border dark:border-gray-800">
                  {notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 text-sm ${
                        !n.read ? "bg-red-50 dark:bg-red-900/20" : ""
                      }`}
                    >
                      <p className="font-medium">{n.title}</p>
                      <p className="text-xs opacity-70">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User */}
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs opacity-60">{user?.designation}</p>
            </div>
          </div>
        </div>
      </header>

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed top-16 left-0 bottom-0 z-40
         dark:bg-[#0f0f0f]
          border-rdark:border-gray-800
          transition-all duration-300
          ${sidebarOpen ? "w-60" : "w-20"}
        `}
      >
        <nav className="mt-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  relative flex items-center gap-4
                  px-4 py-3 mx-2 rounded-xl
                  transition
                  ${
                    active
                      ? "bg-gray-200 dark:bg-white-900/20 text-[#181819]"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }
                `}
              >
                {active && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-gray-600" />
                )}

                <Icon className="w-6 h-6 shrink-0" />

                {sidebarOpen && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-0 right-0 px-3">
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <LogOut className="w-6 h-6" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? "lg:pl-60" : "lg:pl-20"
        }`}
      >
        <div className="p-4">
          <Outlet />
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;