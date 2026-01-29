import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Search,
  Download,
  Upload,
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

  const filteredDocuments = allDocuments.filter(doc => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.complianceItem.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || doc.category === parseInt(categoryFilter);

    const matchesPlant =
      plantFilter === 'all' || doc.plantId === parseInt(plantFilter);

    let matchesExpiry = true;
    if (expiryFilter !== 'all') {
      const days = differenceInDays(new Date(doc.dueDate), new Date());
      if (expiryFilter === 'expired') matchesExpiry = days < 0;
      else if (expiryFilter === '30') matchesExpiry = days >= 0 && days <= 30;
      else if (expiryFilter === '60') matchesExpiry = days > 30 && days <= 60;
      else if (expiryFilter === '90') matchesExpiry = days > 60 && days <= 90;
    }

    return matchesSearch && matchesCategory && matchesPlant && matchesExpiry;
  });

  const expiryStats = {
    expired: allDocuments.filter(d => differenceInDays(new Date(d.dueDate), new Date()) < 0).length,
    next30Days: allDocuments.filter(d => {
      const days = differenceInDays(new Date(d.dueDate), new Date());
      return days >= 0 && days <= 30;
    }).length,
    next60Days: allDocuments.filter(d => {
      const days = differenceInDays(new Date(d.dueDate), new Date());
      return days > 30 && days <= 60;
    }).length,
    next90Days: allDocuments.filter(d => {
      const days = differenceInDays(new Date(d.dueDate), new Date());
      return days > 60 && days <= 90;
    }).length
  };

  const getExpiryBadge = (dueDate) => {
    const daysUntil = differenceInDays(new Date(dueDate), new Date());

    if (daysUntil < 0) {
      return { text: 'Expired', color: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400', icon: AlertCircle };
    } else if (daysUntil <= 30) {
      return { text: `Expires in ${daysUntil} days`, color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400', icon: Clock };
    } else if (daysUntil <= 90) {
      return { text: `Expires in ${daysUntil} days`, color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400', icon: Clock };
    } else {
      return { text: 'Valid', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400', icon: CheckCircle };
    }
  };
  

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Document Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage and track all compliance documents
          </p>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition">
            <Upload size={16} />
            Upload
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Expired Documents" value={expiryStats.expired} color="red" icon={AlertCircle} />
        <StatCard title="Expiring in 30 Days" value={expiryStats.next30Days} color="orange" icon={Clock} />
        <StatCard title="Expiring in 60 Days" value={expiryStats.next60Days} color="yellow" icon={Clock} />
        <StatCard title="Expiring in 90 Days" value={expiryStats.next90Days} color="blue" icon={Clock} />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="py-2 px-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          {user?.role === 'corporate' && (
            <select value={plantFilter} onChange={e => setPlantFilter(e.target.value)}
              className="py-2 px-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              <option value="all">All Plants</option>
              {plants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          )}

          <select value={expiryFilter} onChange={e => setExpiryFilter(e.target.value)}
            className="py-2 px-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            <option value="all">All Documents</option>
            <option value="expired">Expired</option>
            <option value="30">Expiring in 30 Days</option>
            <option value="60">Expiring in 60 Days</option>
            <option value="90">Expiring in 90 Days</option>
          </select>
        </div>

        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Showing {filteredDocuments.length} of {allDocuments.length} documents
        </p>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 uppercase">
            <tr>
              {['Document','Compliance','Plant','Category','Uploaded','Status','Actions'].map(h => (
                <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredDocuments.map((doc, i) => {
              const badge = getExpiryBadge(doc.dueDate);
              const Icon = badge.icon;

              return (
                <tr key={`${doc.id}-${i}`} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 text-sm">{doc.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{doc.complianceItem}</td>
                  <td className="px-6 py-4 text-sm">{doc.plantName}</td>
                  <td className="px-6 py-4 text-sm">{doc.categoryName}</td>
                  <td className="px-6 py-4 text-sm">{format(new Date(doc.uploadedDate), 'dd MMM yyyy')}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs ${badge.color}`}>
                      <Icon size={12} /> {badge.text}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <Eye size={16} className="text-gray-500 hover:text-indigo-600 cursor-pointer" />
                    <Download size={16} className="text-gray-500 hover:text-indigo-600 cursor-pointer" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color, icon: Icon }) => {
  const map = {
    red: 'text-red-500 bg-red-50 dark:bg-red-900/20',
    orange: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
    yellow: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    blue: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 flex justify-between items-center">
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${map[color]}`}>
        <Icon size={20} />
      </div>
    </div>
  );
};

export default Documents;
