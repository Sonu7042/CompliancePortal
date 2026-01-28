import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Search,
  Filter,
  Download,
  Upload,
  Calendar,
  Building2,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const Documents = () => {
  const { getFilteredItems, categories, plants, user } = useApp();
  const items = getFilteredItems();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [plantFilter, setPlantFilter] = useState('all');
  const [expiryFilter, setExpiryFilter] = useState('all');

  // Extract all documents from compliance items
  const allDocuments = items.flatMap(item =>
    item.documents.map(doc => ({
      ...doc,
      complianceItem: item.title,
      plantName: item.plantName,
      plantId: item.plantId,
      category: item.category,
      categoryName: item.categoryName,
      dueDate: item.dueDate,
      status: item.status
    }))
  );

  // Filter documents
  const filteredDocuments = allDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.complianceItem.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === parseInt(categoryFilter);
    const matchesPlant = plantFilter === 'all' || doc.plantId === parseInt(plantFilter);

    let matchesExpiry = true;
    if (expiryFilter !== 'all') {
      const daysUntilDue = differenceInDays(new Date(doc.dueDate), new Date());
      if (expiryFilter === 'expired') matchesExpiry = daysUntilDue < 0;
      else if (expiryFilter === '30') matchesExpiry = daysUntilDue >= 0 && daysUntilDue <= 30;
      else if (expiryFilter === '60') matchesExpiry = daysUntilDue > 30 && daysUntilDue <= 60;
      else if (expiryFilter === '90') matchesExpiry = daysUntilDue > 60 && daysUntilDue <= 90;
    }

    return matchesSearch && matchesCategory && matchesPlant && matchesExpiry;
  });

  // Document expiry stats
  const expiryStats = {
    expired: allDocuments.filter(doc => differenceInDays(new Date(doc.dueDate), new Date()) < 0).length,
    next30Days: allDocuments.filter(doc => {
      const days = differenceInDays(new Date(doc.dueDate), new Date());
      return days >= 0 && days <= 30;
    }).length,
    next60Days: allDocuments.filter(doc => {
      const days = differenceInDays(new Date(doc.dueDate), new Date());
      return days > 30 && days <= 60;
    }).length,
    next90Days: allDocuments.filter(doc => {
      const days = differenceInDays(new Date(doc.dueDate), new Date());
      return days > 60 && days <= 90;
    }).length
  };

  const getExpiryBadge = (dueDate) => {
    const daysUntil = differenceInDays(new Date(dueDate), new Date());

    if (daysUntil < 0) {
      return { text: 'Expired', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: AlertCircle };
    } else if (daysUntil <= 30) {
      return { text: `Expires in ${daysUntil} days`, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: Clock };
    } else if (daysUntil <= 90) {
      return { text: `Expires in ${daysUntil} days`, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock };
    } else {
      return { text: 'Valid', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Document Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track all compliance documents
          </p>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            <span>Export List</span>
          </button>
        </div>
      </div>

      {/* Document Expiry Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Expired Documents"
          value={expiryStats.expired}
          color="red"
          icon={AlertCircle}
        />
        <StatCard
          title="Expiring in 30 Days"
          value={expiryStats.next30Days}
          color="orange"
          icon={Clock}
        />
        <StatCard
          title="Expiring in 60 Days"
          value={expiryStats.next60Days}
          color="yellow"
          icon={Clock}
        />
        <StatCard
          title="Expiring in 90 Days"
          value={expiryStats.next90Days}
          color="blue"
          icon={Clock}
        />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {user?.role === 'corporate' && (
            <select
              value={plantFilter}
              onChange={(e) => setPlantFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Plants</option>
              {plants.map(plant => (
                <option key={plant.id} value={plant.id}>{plant.name}</option>
              ))}
            </select>
          )}

          <select
            value={expiryFilter}
            onChange={(e) => setExpiryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Documents</option>
            <option value="expired">Expired</option>
            <option value="30">Expiring in 30 Days</option>
            <option value="60">Expiring in 60 Days</option>
            <option value="90">Expiring in 90 Days</option>
          </select>
        </div>

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredDocuments.length} of {allDocuments.length} documents
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Document Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Compliance Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Plant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Uploaded Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Expiry Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDocuments.map((doc, index) => {
                const expiryInfo = getExpiryBadge(doc.dueDate);
                const ExpiryIcon = expiryInfo.icon;

                return (
                  <tr key={`${doc.id}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {doc.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {doc.size}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{doc.complianceItem}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{doc.plantName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{doc.categoryName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {format(new Date(doc.uploadedDate), 'dd MMM yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded ${expiryInfo.color}`}>
                          <ExpiryIcon className="w-3 h-3" />
                          <span>{expiryInfo.text}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No documents found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or upload new documents
          </p>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, color, icon: Icon }) => {
  const colorClasses = {
    red: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`p-4 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
};

export default Documents;
