import React from 'react';
import { useApp } from '../context/AppContext';
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
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  AlertCircle,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  Calendar as CalendarIcon,
  BarChart3
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const Dashboard = () => {
  const { getDashboardMetrics, getCategoryBreakdown, getPlantComparison, historicalData, getFilteredItems, user } = useApp();

  const metrics = getDashboardMetrics();
  const categoryData = getCategoryBreakdown();
  const plantData = getPlantComparison();
  const items = getFilteredItems();

  // Status colors
  const COLORS = {
    compliant: '#10B981',
    pending: '#F59E0B',
    inProgress: '#3B82F6',
    overdue: '#F97316',
    nonCompliant: '#EF4444'
  };

  // Prepare data for charts
  const yearlyData = historicalData.map(month => ({
    month: month.month,
    Compliant: month.compliant,
    Pending: month.pending,
    'In Progress': month.inProgress,
    Overdue: month.overdue,
    Rate: month.complianceRate
  }));

  const categoryChartData = categoryData.map(cat => ({
    name: cat.name.split(' ')[0], // Short name
    value: cat.total,
    compliant: cat.compliant,
    rate: cat.complianceRate
  }));

  const plantChartData = plantData.map(plant => ({
    name: plant.code,
    fullName: plant.name,
    rate: plant.complianceRate,
    compliant: plant.compliant,
    total: plant.total
  }));

  // Status distribution for pie chart
  const statusDistribution = [
    { name: 'Compliant', value: metrics.compliant, color: COLORS.compliant },
    { name: 'Pending', value: metrics.pending, color: COLORS.pending },
    { name: 'Overdue', value: metrics.overdue, color: COLORS.overdue },
    { name: 'Non-Compliant', value: metrics.nonCompliant, color: COLORS.nonCompliant }
  ];

  // Upcoming items
  const upcomingItems = items
    .filter(item => {
      const daysUntil = Math.floor((new Date(item.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
      return daysUntil >= 0 && daysUntil <= 30 && item.status !== 'compliant';
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  // Recent non-compliances
  const recentNonCompliant = items
    .filter(item => item.status === 'non_compliant' || item.status === 'overdue')
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back, {user?.name}
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Compliance Items"
          value={metrics.total}
          icon={FileText}
          color="blue"
          trend="+5.2%"
        />
        <MetricCard
          title="Compliance Rate"
          value={`${metrics.complianceRate}%`}
          icon={CheckCircle}
          color="green"
          trend="+2.1%"
        />
        <MetricCard
          title="Non-Compliances"
          value={metrics.nonCompliant + metrics.overdue}
          icon={XCircle}
          color="red"
          trend="-1.3%"
          trendPositive={true}
        />
        <MetricCard
          title="Upcoming (30 days)"
          value={metrics.upcoming.next30Days}
          icon={Clock}
          color="orange"
        />
      </div>

      {/* Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DeadlineCard
          title="Next 7 Days"
          count={metrics.upcoming.next7Days}
          color="red"
        />
        <DeadlineCard
          title="Next 15 Days"
          count={metrics.upcoming.next15Days}
          color="orange"
        />
        <DeadlineCard
          title="Next 30 Days"
          count={metrics.upcoming.next30Days}
          color="yellow"
        />
      </div>

      {/* Year-wise Compliance Trend */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Year-wise Compliance Status
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Monthly compliance trend for the past 12 months
            </p>
          </div>
          <BarChart3 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={yearlyData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis
              dataKey="month"
              className="text-gray-600 dark:text-gray-400"
              tick={{ fontSize: 12 }}
            />
            <YAxis className="text-gray-600 dark:text-gray-400" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="Compliant"
              stackId="1"
              stroke={COLORS.compliant}
              fill={COLORS.compliant}
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="In Progress"
              stackId="1"
              stroke={COLORS.inProgress}
              fill={COLORS.inProgress}
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="Pending"
              stackId="1"
              stroke={COLORS.pending}
              fill={COLORS.pending}
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="Overdue"
              stackId="1"
              stroke={COLORS.overdue}
              fill={COLORS.overdue}
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Compliance Rate Line */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Compliance Rate Trend (%)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis
                dataKey="month"
                className="text-gray-600 dark:text-gray-400"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                className="text-gray-600 dark:text-gray-400"
                tick={{ fontSize: 12 }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="Rate"
                stroke="#6366F1"
                strokeWidth={3}
                dot={{ fill: '#6366F1', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category and Plant Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category-wise Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Category-wise Breakdown
          </h2>

          <div className="space-y-4 mb-6">
            {categoryData.map((cat, index) => (
              <div key={cat.id}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {cat.name}
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {cat.complianceRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${cat.complianceRate}%`,
                      backgroundColor: cat.complianceRate >= 90 ? COLORS.compliant : cat.complianceRate >= 70 ? COLORS.pending : COLORS.overdue
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {cat.compliant} of {cat.total} items compliant
                </p>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Plant-wise Comparison */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Plant-wise Compliance Comparison
          </h2>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={plantChartData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis
                type="number"
                domain={[0, 100]}
                className="text-gray-600 dark:text-gray-400"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="name"
                className="text-gray-600 dark:text-gray-400"
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                content={({ payload }) => {
                  if (payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {data.fullName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Compliance Rate: {data.rate}%
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {data.compliant} of {data.total} compliant
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="rate" fill="#6366F1" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* Best and Worst Performers */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Best Performer</p>
              <p className="font-semibold text-green-700 dark:text-green-400">
                {plantData.sort((a, b) => b.complianceRate - a.complianceRate)[0]?.name}
              </p>
              <p className="text-xl font-bold text-green-700 dark:text-green-400">
                {plantData.sort((a, b) => b.complianceRate - a.complianceRate)[0]?.complianceRate}%
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Needs Attention</p>
              <p className="font-semibold text-red-700 dark:text-red-400">
                {plantData.sort((a, b) => a.complianceRate - b.complianceRate)[0]?.name}
              </p>
              <p className="text-xl font-bold text-red-700 dark:text-red-400">
                {plantData.sort((a, b) => a.complianceRate - b.complianceRate)[0]?.complianceRate}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming and Non-Compliant Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Items */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Upcoming Deadlines (Next 30 Days)
          </h2>
          <div className="space-y-3">
            {upcomingItems.map(item => {
              const daysUntil = Math.floor((new Date(item.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
              return (
                <div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <CalendarIcon className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {item.plantName} • {item.categoryName}
                    </p>
                    <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mt-1">
                      Due in {daysUntil} days ({format(new Date(item.dueDate), 'dd MMM yyyy')})
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    item.priority === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    item.priority === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {item.priority}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Non-Compliant Items */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Non-Compliances
          </h2>
          <div className="space-y-3">
            {recentNonCompliant.map(item => (
              <div key={item.id} className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {item.plantName} • {item.categoryName}
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium mt-1">
                    {item.status === 'overdue' ? 'Overdue' : 'Non-Compliant'} • Due: {format(new Date(item.dueDate), 'dd MMM yyyy')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, color, trend, trendPositive = false }) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    red: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className={`w-4 h-4 ${trendPositive ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-sm ml-1 ${trendPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {trend}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
};

// Deadline Card Component
const DeadlineCard = ({ title, count, color }) => {
  const colorClasses = {
    red: 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20',
    orange: 'border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20',
    yellow: 'border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20'
  };

  const textColorClasses = {
    red: 'text-red-700 dark:text-red-400',
    orange: 'text-orange-700 dark:text-orange-400',
    yellow: 'text-yellow-700 dark:text-yellow-400'
  };

  return (
    <div className={`border-2 rounded-xl p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className={`text-4xl font-bold ${textColorClasses[color]}`}>{count}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">compliance items</p>
        </div>
        <Clock className={`w-12 h-12 ${textColorClasses[color]} opacity-50`} />
      </div>
    </div>
  );
};

export default Dashboard;
