import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  FileSpreadsheet,
  Filter,
  Eye
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format, startOfMonth, endOfMonth } from 'date-fns';

const Reports = () => {
  const {
    getDashboardMetrics,
    getCategoryBreakdown,
    getPlantComparison,
    historicalData,
    getFilteredItems,
    user
  } = useApp();

  const [dateRange, setDateRange] = useState('month');
  const [selectedReport, setSelectedReport] = useState(null);

  const metrics = getDashboardMetrics();
  const categoryData = getCategoryBreakdown();
  const plantData = getPlantComparison();
  const items = getFilteredItems();

  // Pre-built reports
  const reports = [
    {
      id: 1,
      name: 'Compliance Summary Report',
      description: 'Overall compliance status across all plants and categories',
      icon: FileText,
      color: 'blue',
      type: 'summary'
    },
    {
      id: 2,
      name: 'Plant Performance Scorecard',
      description: 'Detailed performance analysis for each plant',
      icon: TrendingUp,
      color: 'green',
      type: 'plant-scorecard'
    },
    {
      id: 3,
      name: 'Non-Compliance Analysis',
      description: 'Detailed report of all non-compliant items with root cause',
      icon: FileSpreadsheet,
      color: 'red',
      type: 'non-compliance'
    },
    {
      id: 4,
      name: 'Document Expiry Report',
      description: 'List of documents expiring in the selected period',
      icon: Calendar,
      color: 'orange',
      type: 'document-expiry'
    },
    {
      id: 5,
      name: 'Trend Analysis Report',
      description: 'Month-over-month and year-over-year compliance trends',
      icon: BarChart3,
      color: 'purple',
      type: 'trend-analysis'
    },
    {
      id: 6,
      name: 'Audit Readiness Report',
      description: 'Comprehensive report for regulatory audit preparation',
      icon: FileText,
      color: 'indigo',
      type: 'audit-readiness'
    },
    {
      id: 7,
      name: 'Category-wise Breakdown',
      description: 'Detailed compliance status by category',
      icon: PieChartIcon,
      color: 'teal',
      type: 'category-breakdown'
    },
    {
      id: 8,
      name: 'Executive Dashboard',
      description: 'One-page summary for management review',
      icon: BarChart3,
      color: 'pink',
      type: 'executive'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    pink: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
  };

  const exportReport = (format) => {
    // Simulate export functionality
    alert(`Exporting report in ${format.toUpperCase()} format...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Reports & Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Generate comprehensive compliance reports
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Items</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Compliance Rate</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{metrics.complianceRate}%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Non-Compliant</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{metrics.nonCompliant}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Overdue</p>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{metrics.overdue}</p>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Report Period:</span>
          </div>
          <div className="flex gap-2">
            {['week', 'month', 'quarter', 'year', 'custom'].map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  dateRange === range
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pre-built Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map(report => {
          const Icon = report.icon;
          return (
            <div
              key={report.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer"
              onClick={() => setSelectedReport(report)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorClasses[report.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {report.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {report.description}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    exportReport('pdf');
                  }}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    exportReport('excel');
                  }}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors text-sm"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Excel</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Preview Section */}
      {selectedReport && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedReport.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Generated on {format(new Date(), 'dd MMM yyyy HH:mm')}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => exportReport('pdf')}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={() => exportReport('excel')}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export Excel</span>
              </button>
            </div>
          </div>

          {/* Report Content based on type */}
          {selectedReport.type === 'summary' && (
            <SummaryReport metrics={metrics} categoryData={categoryData} plantData={plantData} />
          )}
          {selectedReport.type === 'trend-analysis' && (
            <TrendAnalysisReport historicalData={historicalData} />
          )}
          {selectedReport.type === 'plant-scorecard' && (
            <PlantScorecardReport plantData={plantData} />
          )}
          {selectedReport.type === 'category-breakdown' && (
            <CategoryBreakdownReport categoryData={categoryData} />
          )}
        </div>
      )}
    </div>
  );
};

// Summary Report Component
const SummaryReport = ({ metrics, categoryData, plantData }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">Total Compliance Items</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.total}</p>
      </div>
      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">Compliant</p>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{metrics.compliant}</p>
      </div>
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">Non-Compliant</p>
        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{metrics.nonCompliant + metrics.overdue}</p>
      </div>
    </div>

    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Performance</h3>
      <div className="space-y-3">
        {categoryData.map(cat => (
          <div key={cat.id}>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-700 dark:text-gray-300">{cat.name}</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{cat.complianceRate}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-indigo-600"
                style={{ width: `${cat.complianceRate}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Trend Analysis Report Component
const TrendAnalysisReport = ({ historicalData }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Compliance Rate Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={historicalData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="complianceRate" stroke="#6366F1" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>

    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status Distribution Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={historicalData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="compliant" stackId="a" fill="#10B981" />
          <Bar dataKey="pending" stackId="a" fill="#F59E0B" />
          <Bar dataKey="overdue" stackId="a" fill="#EF4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// Plant Scorecard Report Component
const PlantScorecardReport = ({ plantData }) => (
  <div className="space-y-6">
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={plantData} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, 100]} />
        <YAxis type="category" dataKey="name" />
        <Tooltip />
        <Legend />
        <Bar dataKey="complianceRate" fill="#6366F1" />
      </BarChart>
    </ResponsiveContainer>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {plantData.map(plant => (
        <div key={plant.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{plant.name}</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Compliance Rate:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{plant.complianceRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Items:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{plant.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Compliant:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">{plant.compliant}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Overdue:</span>
              <span className="font-semibold text-red-600 dark:text-red-400">{plant.overdue}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Category Breakdown Report Component
const CategoryBreakdownReport = ({ categoryData }) => {
  const COLORS = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#6B7280'];

  return (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, complianceRate }) => `${name.split(' ')[0]}: ${complianceRate}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="total"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoryData.map(cat => (
          <div key={cat.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{cat.name}</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Compliance Rate:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{cat.complianceRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Items:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{cat.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Compliant:</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{cat.compliant}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
