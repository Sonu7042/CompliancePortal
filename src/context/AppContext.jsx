import React, { createContext, useContext, useState, useEffect } from 'react';
import mockData from '../data/mockData';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'light';
  });

  // Authentication state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // Application data
  const [complianceItems, setComplianceItems] = useState(mockData.complianceItems);
  const [notifications, setNotifications] = useState(mockData.notifications);
  const [plants] = useState(mockData.plants);
  const [categories] = useState(mockData.categories);
  const [historicalData] = useState(mockData.historicalData);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState(null);

  // Theme toggle
  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  // Authentication
  const login = (username, password) => {
    const foundUser = mockData.users.find(
      u => u.username === username && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));

      // Set selected plant for plant users
      if (foundUser.role === 'plant' && foundUser.plantId) {
        setSelectedPlant(plants.find(p => p.id === foundUser.plantId));
      }

      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setSelectedPlant(null);
    localStorage.removeItem('user');
  };

  // Compliance operations
  const updateComplianceStatus = (itemId, newStatus) => {
    setComplianceItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? {
              ...item,
              status: newStatus,
              completedDate: newStatus === 'compliant' ? new Date() : item.completedDate
            }
          : item
      )
    );
  };

  const addDocument = (itemId, document) => {
    setComplianceItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, documents: [...item.documents, document] }
          : item
      )
    );
  };

  const addComment = (itemId, comment) => {
    setComplianceItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? {
              ...item,
              comments: [
                ...item.comments,
                {
                  id: Math.random().toString(36).substr(2, 9),
                  text: comment,
                  author: user.name,
                  date: new Date()
                }
              ]
            }
          : item
      )
    );
  };

  // Notification operations
  const markNotificationRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  // Calculations
  const getFilteredItems = () => {
    if (user?.role === 'plant' && user.plantId) {
      return complianceItems.filter(item => item.plantId === user.plantId);
    }
    if (selectedPlant) {
      return complianceItems.filter(item => item.plantId === selectedPlant.id);
    }
    return complianceItems;
  };

  const getDashboardMetrics = () => {
    const items = getFilteredItems();
    const total = items.length;
    const compliant = items.filter(i => i.status === 'compliant').length;
    const nonCompliant = items.filter(i => i.status === 'non_compliant').length;
    const overdue = items.filter(i => i.status === 'overdue').length;
    const pending = items.filter(i => i.status === 'pending').length;

    // Upcoming deadlines
    const today = new Date();
    const next7Days = items.filter(i => {
      const daysUntil = Math.floor((new Date(i.dueDate) - today) / (1000 * 60 * 60 * 24));
      return daysUntil >= 0 && daysUntil <= 7 && i.status !== 'compliant';
    }).length;

    const next15Days = items.filter(i => {
      const daysUntil = Math.floor((new Date(i.dueDate) - today) / (1000 * 60 * 60 * 24));
      return daysUntil >= 0 && daysUntil <= 15 && i.status !== 'compliant';
    }).length;

    const next30Days = items.filter(i => {
      const daysUntil = Math.floor((new Date(i.dueDate) - today) / (1000 * 60 * 60 * 24));
      return daysUntil >= 0 && daysUntil <= 30 && i.status !== 'compliant';
    }).length;

    // Documents expiring soon
    const expiringDocs = items.filter(i => {
      const daysUntil = Math.floor((new Date(i.dueDate) - today) / (1000 * 60 * 60 * 24));
      return daysUntil >= 0 && daysUntil <= 30;
    }).length;

    return {
      total,
      compliant,
      nonCompliant,
      overdue,
      pending,
      complianceRate: total > 0 ? Math.round((compliant / total) * 100) : 0,
      upcoming: {
        next7Days,
        next15Days,
        next30Days
      },
      expiringDocs
    };
  };

  const getCategoryBreakdown = () => {
    const items = getFilteredItems();
    return categories.map(cat => {
      const categoryItems = items.filter(i => i.category === cat.id);
      const compliant = categoryItems.filter(i => i.status === 'compliant').length;
      return {
        ...cat,
        total: categoryItems.length,
        compliant,
        complianceRate: categoryItems.length > 0 ? Math.round((compliant / categoryItems.length) * 100) : 0
      };
    });
  };

  const getPlantComparison = () => {
    return plants.map(plant => {
      const plantItems = complianceItems.filter(i => i.plantId === plant.id);
      const compliant = plantItems.filter(i => i.status === 'compliant').length;
      const overdue = plantItems.filter(i => i.status === 'overdue').length;
      const nonCompliant = plantItems.filter(i => i.status === 'non_compliant').length;

      return {
        ...plant,
        total: plantItems.length,
        compliant,
        overdue,
        nonCompliant,
        complianceRate: plantItems.length > 0 ? Math.round((compliant / plantItems.length) * 100) : 0
      };
    });
  };

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const value = {
    // Theme
    theme,
    toggleTheme,

    // Auth
    user,
    login,
    logout,

    // Data
    complianceItems,
    notifications,
    plants,
    categories,
    historicalData,

    // UI State
    sidebarOpen,
    setSidebarOpen,
    selectedPlant,
    setSelectedPlant,

    // Operations
    updateComplianceStatus,
    addDocument,
    addComment,
    markNotificationRead,
    markAllNotificationsRead,

    // Calculations
    getFilteredItems,
    getDashboardMetrics,
    getCategoryBreakdown,
    getPlantComparison
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
