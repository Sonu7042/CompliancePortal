// import React, { useState } from 'react';
// import { useApp } from '../context/AppContext';
// import { Link, useLocation, Outlet } from 'react-router-dom';
// import {
//   LayoutDashboard,
//   CheckSquare,
//   FileText,
//   BarChart3,
//   Calendar,
//   Bell,
//   Settings,
//   LogOut,
//   Menu,
//   X,
//   Sun,
//   Moon,
//   Building2,
//   ChevronDown
// } from 'lucide-react';

// const Layout = () => {
//   const { user, logout, theme, toggleTheme, notifications, plants, selectedPlant, setSelectedPlant, sidebarOpen, setSidebarOpen } = useApp();
//   const location = useLocation();
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showPlantMenu, setShowPlantMenu] = useState(false);

//   const unreadCount = notifications.filter(n => !n.read).length;

//   const navigation = [
//     { name: 'Home', href: '/', icon: LayoutDashboard },
//     { name: 'Tasks', href: '/tasks', icon: CheckSquare },
//     { name: 'Documents', href: '/documents', icon: FileText },
//     { name: 'Reports', href: '/reports', icon: BarChart3 },
//     { name: 'Calendar', href: '/calendar', icon: Calendar },
//   ];

//   const isActive = (href) => {
//     if (href === '/') {
//       return location.pathname === '/';
//     }
//     return location.pathname.startsWith(href);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f] transition-colors font-sansSelection">
//       {/* Header */}
//       <header className="bg-white dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-gray-800 fixed top-0 left-0 right-0 z-40 h-14">
//         <div className="flex items-center justify-between h-full px-4">
//           {/* Left side */}
//           <div className="flex items-center">
//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//             >
//               <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
//             </button>

//             <Link to="/" className="flex items-center space-x-2">
//               <div className="flex items-center space-x-1">
//                 <div className="w-8 h-8 md:w-9 md:h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
//                   <Building2 className="w-5 h-5 text-white" />
//                 </div>
//                 <div className="hidden sm:block ml-2">
//                   <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
//                     Compliance<span className="text-indigo-600">Portal</span>
//                   </h1>
//                 </div>
//               </div>
//             </Link>
//           </div>

//           {/* Center - Search (optional, adding for authentic look) */}
//           <div className="hidden md:flex flex-1 max-w-2xl px-8">
//             <div className="relative w-full">
//               <input
//                 type="text"
//                 placeholder="Search"
//                 className="w-full h-10 px-4 bg-gray-100 dark:bg-[#121212] border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 text-sm dark:text-white"
//               />
//             </div>
//           </div>

//           {/* Right side */}
//           <div className="flex items-center space-x-1 sm:space-x-3">
//             {/* Plant Selector */}
//             {user?.role === 'corporate' && (
//               <div className="relative">
//                 <button
//                   onClick={() => setShowPlantMenu(!showPlantMenu)}
//                   className="flex items-center space-x-2 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-800"
//                 >
//                   <Building2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
//                   <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden lg:block">
//                     {selectedPlant ? selectedPlant.name : 'All Plants'}
//                   </span>
//                   <ChevronDown className="w-4 h-4 text-gray-400" />
//                 </button>

//                 {showPlantMenu && (
//                   <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#282828] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 py-2 z-50 animate-in fade-in zoom-in duration-200">
//                     <button
//                       onClick={() => {
//                         setSelectedPlant(null);
//                         setShowPlantMenu(false);
//                       }}
//                       className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
//                     >
//                       All Plants
//                     </button>
//                     {plants.map(plant => (
//                       <button
//                         key={plant.id}
//                         onClick={() => {
//                           setSelectedPlant(plant);
//                           setShowPlantMenu(false);
//                         }}
//                         className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 flex items-center justify-between"
//                       >
//                         {plant.name}
//                         {selectedPlant?.id === plant.id && <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Notifications */}
//             <div className="relative">
//               <button
//                 onClick={() => setShowNotifications(!showNotifications)}
//                 className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative transition-colors"
//               >
//                 <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
//                 {unreadCount > 0 && (
//                   <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 border-2 border-white dark:border-[#0f0f0f] rounded-full text-[10px] font-bold text-white flex items-center justify-center">
//                     {unreadCount}
//                   </span>
//                 )}
//               </button>

//               {showNotifications && (
//                 <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#282828] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 z-50 max-h-[80vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
//                   <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
//                     <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
//                     <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium tracking-tight">Mark all read</button>
//                   </div>
//                   <div className="divide-y divide-gray-100 dark:divide-gray-800">
//                     {notifications.length > 0 ? (
//                       notifications.slice(0, 5).map(notif => (
//                         <div
//                           key={notif.id}
//                           className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${!notif.read ? 'bg-blue-50/50 dark:bg-indigo-900/10' : ''}`}
//                         >
//                           <div className="flex justify-between items-start">
//                             <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
//                               {notif.title}
//                             </h4>
//                             {!notif.read && (
//                               <span className="shrink-0 w-2 h-2 bg-indigo-500 rounded-full mt-1.5"></span>
//                             )}
//                           </div>
//                           <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
//                             {notif.message}
//                           </p>
//                           <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 font-medium">
//                             {notif.time}
//                           </p>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
//                         No notifications yet
//                       </div>
//                     )}
//                   </div>
//                   <div className="p-3 bg-gray-50 dark:bg-gray-800/20 text-center">
//                     <button className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
//                       View All
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Theme Toggle */}
//             <button
//               onClick={toggleTheme}
//               className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//             >
//               {theme === 'light' ? (
//                 <Moon className="w-5 h-5 text-gray-600" />
//               ) : (
//                 <Sun className="w-5 h-5 text-indigo-400" />
//               )}
//             </button>

//             {/* User Profile */}
//             <div className="flex items-center ml-2 border-l border-gray-200 dark:border-gray-800 pl-4 h-8">
//               <div className="hidden sm:flex flex-col items-end mr-3">
//                 <span className="text-xs font-bold text-gray-900 dark:text-white leading-none mb-0.5">{user?.name}</span>
//                 <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider leading-none">{user?.role}</span>
//               </div>
//               <button
//                 onClick={logout}
//                 className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center border border-indigo-200 dark:border-indigo-800 hover:ring-2 hover:ring-indigo-500/20 transition-all"
//                 title="Logout"
//               >
//                 <LogOut className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Sidebar - Desktop Layout */}
//       {/* Expanded Sidebar (Desktop) */}
//       <aside
//         className={`fixed left-0 top-14 bottom-0 bg-white dark:bg-[#0f0f0f] transition-all duration-300 z-30 overflow-y-auto hidden lg:block ${sidebarOpen ? 'w-60 px-3' : 'w-20 px-1'
//           }`}
//       >
//         <div className="py-2 space-y-1">
//           {navigation.map((item) => {
//             const Icon = item.icon;
//             const active = isActive(item.href);

//             return (
//               <Link
//                 key={item.name}
//                 to={item.href}
//                 className={`flex flex-col lg:flex-row items-center transition-all group ${sidebarOpen
//                     ? 'space-x-4 px-3 py-3 rounded-xl'
//                     : 'justify-center py-4 rounded-lg mx-auto w-16'
//                   } ${active
//                     ? 'bg-indigo-50 dark:bg-[#282828] text-indigo-600 dark:text-white'
//                     : 'text-gray-700 dark:text-[#f1f1f1] hover:bg-gray-100 dark:hover:bg-[#282828]'
//                   }`}
//               >
//                 <Icon className={`w-5 h-5 ${active ? 'text-indigo-600 dark:text-white' : 'text-gray-600 dark:text-[#f1f1f1]'}`} />
//                 <span className={`transition-all duration-200 origin-left font-medium ${sidebarOpen
//                     ? 'text-[14px] opacity-100'
//                     : 'text-[10px] mt-1 line-clamp-1 opacity-100 font-normal truncate max-w-full text-center'
//                   }`}>
//                   {item.name}
//                 </span>
//               </Link>
//             );
//           })}
//         </div>

//         {sidebarOpen && <div className="my-4 mx-3 border-t border-gray-200 dark:border-gray-800" />}

//         {/* Plant Badge (Only when open) */}
//         {sidebarOpen && user?.role === 'plant' && user.plantId && (
//           <div className="px-3 py-4">
//             <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-900/20">
//               <div className="flex items-center space-x-2 mb-2">
//                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
//                 <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Active Plant</p>
//               </div>
//               <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
//                 {plants.find(p => p.id === user.plantId)?.name}
//               </p>
//               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
//                 {plants.find(p => p.id === user.plantId)?.location}
//               </p>
//             </div>
//           </div>
//         )}
//       </aside>

//       {/* Mobile Drawer */}
//       <aside
//         className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-[#0f0f0f] shadow-2xl z-[60] transform lg:hidden transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//           }`}
//       >
//         <div className="h-14 flex items-center px-4 border-b border-gray-100 dark:border-gray-800">
//           <button
//             onClick={() => setSidebarOpen(false)}
//             className="p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
//           >
//             <Menu className="w-5 h-5 dark:text-white" />
//           </button>
//           <span className="font-bold text-lg dark:text-white">Compliance<span className="text-indigo-600">Portal</span></span>
//         </div>
//         <div className="p-3 space-y-1">
//           {navigation.map((item) => {
//             const Icon = item.icon;
//             const active = isActive(item.href);
//             return (
//               <Link
//                 key={item.name}
//                 to={item.href}
//                 onClick={() => setSidebarOpen(false)}
//                 className={`flex items-center space-x-4 px-3 py-3 rounded-xl transition-all ${active
//                     ? 'bg-indigo-50 dark:bg-[#282828] text-indigo-600 dark:text-white'
//                     : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#282828]'
//                   }`}
//               >
//                 <Icon className="w-5 h-5" />
//                 <span className="text-sm font-medium">{item.name}</span>
//               </Link>
//             );
//           })}
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className={`pt-14 transition-all duration-300 min-h-screen ${sidebarOpen ? 'lg:pl-60' : 'lg:pl-20'
//         }`}>
//         <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
//           <Outlet />
//         </div>
//       </main>

//       {/* Mobile Overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 lg:hidden animate-in fade-in duration-300"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default Layout;

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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f]">
      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-white dark:bg-[#0f0f0f]  ">
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
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
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
          bg-white dark:bg-[#0f0f0f]
          border-r border-gray-200 dark:border-gray-800
          transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-20"}
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
                      ? "bg-red-50 dark:bg-red-900/20 text-red-600"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
              >
                {active && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-red-600 rounded-r-full" />
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
          sidebarOpen ? "lg:pl-64" : "lg:pl-20"
        }`}
      >
        <div className="p-6">
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
