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
  ResponsiveContainer
} from 'recharts';
import {
  AlertCircle,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  Calendar as CalendarIcon,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';

const ICON_COLORS = {
  green: 'text-emerald-500',
  red: 'text-rose-500',
  orange: 'text-amber-500',
  blue: 'text-indigo-500'
};

const GRAPH = {
  primary: '#4F46E5',
  secondary: '#EF4444',
  grid: '#E5E7EB'
};

const Dashboard = () => {
  const {
    getDashboardMetrics,
    getPlantComparison,
    historicalData,
    getFilteredItems,
    user
  } = useApp();

  const metrics = getDashboardMetrics();
  const plantData = getPlantComparison();
  const items = getFilteredItems();

  const yearlyData = historicalData.map(m => ({
    month: m.month,
    primary: m.compliant,
    secondary: m.pending
  }));

  const statusDistribution = [
    { name: 'Compliant', value: metrics.compliant, color: '#10B981' },
    { name: 'Pending', value: metrics.pending, color: '#F59E0B' },
    { name: 'Overdue', value: metrics.overdue, color: '#F97316' },
    { name: 'Non-Compliant', value: metrics.nonCompliant, color: '#EF4444' }
  ];

  const upcomingItems = items
    .filter(i => {
      const d = (new Date(i.dueDate) - new Date()) / 86400000;
      return d >= 0 && d <= 30 && i.status !== 'compliant';
    })
    .slice(0, 5);

  const recentNonCompliant = items
    .filter(i => i.status === 'overdue' || i.status === 'non_compliant')
    .slice(0, 5);

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Compliance Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome back, {user?.name}
        </p>
      </div>

      {/* MAIN GRAPH */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

        <div className="xl:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Risk Timeline</h2>
              <p className="text-sm text-gray-500">30 day comparison</p>
            </div>
            <BarChart3 className="w-7 h-7 text-indigo-500" />
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yearlyData}>
              <CartesianGrid stroke={GRAPH.grid} strokeDasharray="3 6" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="secondary"
                stroke={GRAPH.secondary}
                strokeDasharray="4 6"
                strokeWidth={2}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="primary"
                stroke={GRAPH.primary}
                strokeWidth={4}
                dot={{ r: 5, fill: '#fff', strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* RIGHT SIDE CARDS (SCREENSHOT COLORS) */}
        <div className="space-y-4">

          <div className="rounded-2xl p-5 bg-[#EEF2FF] shadow-sm">
            <p className="text-xs text-gray-500">Threat</p>
            <h4 className="font-semibold">Supplier Data Encryption Attack</h4>
            <div className="flex justify-between mt-4">
              <span className="text-sm text-gray-500">Priority</span>
              <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-sm font-semibold">2</span>
            </div>
          </div>

          <div className="rounded-2xl p-5 bg-black shadow-sm">
            <p className="text-xs text-gray-400">Vulnerability</p>
            <h4 className="font-semibold text-white">Vendors Data Encryption Attack</h4>
            <div className="flex justify-between mt-4">
              <span className="text-sm text-gray-400">Priority</span>
              <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-sm font-semibold text-black">5</span>
            </div>
          </div>

          <div className="rounded-2xl p-5 bg-[#FFF1F2] shadow-sm">
            <p className="text-xs text-gray-500">Asset</p>
            <h4 className="font-semibold">Data Center Servers</h4>
            <div className="flex justify-between mt-4">
              <span className="text-sm text-gray-500">Priority</span>
              <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-sm font-semibold">4</span>
            </div>
          </div>

        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="Total Items" value={metrics.total} icon={FileText} color="blue" />
        <MetricCard title="Compliant" value={metrics.compliant} icon={CheckCircle} color="green" />
        <MetricCard title="Overdue" value={metrics.overdue} icon={Clock} color="orange" />
        <MetricCard title="Upcoming" value={metrics.upcoming.next30Days} icon={CalendarIcon} color="red" />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Status Distribution">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusDistribution} dataKey="value" outerRadius={90}>
                {statusDistribution.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Plant Comparison">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={plantData.map(p => ({ name: p.code, rate: p.complianceRate }))}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="rate" fill={GRAPH.primary} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* LISTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ListCard title="Upcoming Deadlines">
          {upcomingItems.map(i => (
            <ListItem key={i.id} icon={CalendarIcon} title={i.title} subtitle={format(new Date(i.dueDate), 'dd MMM yyyy')} color="orange" />
          ))}
        </ListCard>

        <ListCard title="Recent Non-Compliances">
          {recentNonCompliant.map(i => (
            <ListItem key={i.id} icon={AlertCircle} title={i.title} subtitle={format(new Date(i.dueDate), 'dd MMM yyyy')} color="red" />
          ))}
        </ListCard>
      </div>
    </div>
  );
};

/* UI PARTS */

const MetricCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex justify-between">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
    <Icon className={`w-8 h-8 ${ICON_COLORS[color]}`} />
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
    <h3 className="font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

const ListCard = ({ title, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
    <h3 className="font-semibold mb-4">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const ListItem = ({ icon: Icon, title, subtitle, color }) => (
  <div className="flex gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
    <Icon className={`w-5 h-5 mt-1 ${ICON_COLORS[color]}`} />
    <div>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  </div>
);

export default Dashboard;
