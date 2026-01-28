import React, { useMemo } from 'react';
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
  BarChart3,
  Calendar as CalendarIcon,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { format } from 'date-fns';

// --- Reusable UI Components ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-[#0f0f0f] dark:border-gray-800 rounded-lg  md:rounded-3xl shadow-sm transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const MetricCard = ({ title, value, icon: Icon, variant, trend, trendPositive = false }) => {
  const styles = {
    primary: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    success: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    danger: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
    warning: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
  };

  return (
    <Card className="p-6 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 group">
  <div className="flex justify-between items-start">
    
    {/* LEFT CONTENT */}
    <div className="">
      <p className="text-[11px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500">
        {title}
      </p>
      <h3 className="text-3xl font-normal text-gray-900 dark:text-white tracking-tight mb-4">
        {value}
      </h3>

      {trend && (
        <div
          className={`inline-flex items-center gap-2 text-xs font-bold px-2 py-1 rounded-full
          ${trendPositive
            ? 'bg-emerald-50 text-emerald-600'
            : 'bg-rose-50 text-rose-600'
          }`}
        >
          {trendPositive ? (
            <ArrowUpRight size={12} />
          ) : (
            <ArrowDownRight size={12} />
          )}
          {trend}
        </div>
      )}
    </div>

    {/* RIGHT BIG ICON */}
    <div
      className={`p-5 rounded-2xl ${styles[variant]} 
      transition-transform duration-300 group-hover:scale-110`}
    >
      <Icon size={36} />
    </div>
  </div>
</Card>

  );
};

const DeadlineInsightCard = ({ title, subtitle, count, variant }) => {
  const themes = {
    danger: 'border-l-4 border-l-rose-500 bg-rose-50/30 dark:bg-rose-500/5',
    warning: 'border-l-4 border-l-amber-500 bg-amber-50/30 dark:bg-amber-500/5',
    info: 'border-l-4 border-l-indigo-500 bg-indigo-50/30 dark:bg-indigo-500/5'
  };

  const textColors = {
    danger: 'text-rose-600 dark:text-rose-400',
    warning: 'text-amber-600 dark:text-amber-400',
    info: 'text-indigo-600 dark:text-indigo-400'
  };

  return (
    <Card className={`p-6 flex items-center justify-between ${themes[variant]}`}>
      <div className="space-y-1">
        <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500">{title}</p>
        <h4 className="text-lg font-normal text-gray-900 dark:text-white">{subtitle}</h4>
      </div>
      <div className={`text-4xl font-bold ${textColors[variant]}`}>{count}</div>
    </Card>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-100 dark:border-gray-800 p-4 rounded-xl shadow-xl">
        <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-tighter">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300">{entry.name}:</span>
              <span className="text-[13px] font-bold text-gray-900 dark:text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// --- Main Dashboard Component ---

const Dashboard = () => {
  const { getDashboardMetrics, getCategoryBreakdown, getPlantComparison, historicalData, getFilteredItems, user } = useApp();

  const metrics = getDashboardMetrics();
  const categoryData = getCategoryBreakdown();
  const plantData = getPlantComparison();
  const items = getFilteredItems();

  const COLORS = {
    compliant: '#10B981',
    pending: '#F59E0B',
    inProgress: '#3B82F6',
    overdue: '#F97316',
    nonCompliant: '#EF4444'
  };

  const chartData = useMemo(() => historicalData.map(month => ({
    month: month.month,
    Compliant: month.compliant,
    Pending: month.pending,
    'In Progress': month.inProgress,
    Overdue: month.overdue,
    Rate: month.complianceRate
  })), [historicalData]);

  const plantChartData = useMemo(() => plantData.map(plant => ({
    name: plant.code,
    fullName: plant.name,
    rate: plant.complianceRate,
    compliant: plant.compliant,
    total: plant.total
  })), [plantData]);

  const statusDistribution = useMemo(() => [
    { name: 'Compliant', value: metrics.compliant, color: COLORS.compliant },
    { name: 'Pending', value: metrics.pending, color: COLORS.pending },
    { name: 'Overdue', value: metrics.overdue, color: COLORS.overdue },
    { name: 'Non-Compliant', value: metrics.nonCompliant, color: COLORS.nonCompliant }
  ], [metrics, COLORS]);

  const upcomingItems = useMemo(() => items
    .filter(item => {
      const daysUntil = Math.floor((new Date(item.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
      return daysUntil >= 0 && daysUntil <= 30 && item.status !== 'compliant';
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5), [items]);

  const recentNonCompliant = useMemo(() => items
    .filter(item => item.status === 'non_compliant' || item.status === 'overdue')
    .slice(0, 5), [items]);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* 1. Header Section */}
      {/* <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-700 to-indigo-900 p-8 lg:p-12 text-white shadow-2xl shadow-indigo-500/20">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-[100px]" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-[80px]" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg shadow-inner">
                <BarChart3 className="text-indigo-200" size={28} />
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">Compliance Hub</h1>
            </div>
            <p className="text-indigo-100/70 text-lg font-medium max-w-xl">
              Real-time compliance monitoring & insights for global operations.
            </p>
          </div>

          <div className="flex items-center gap-5 bg-white/10 backdrop-blur-xl rounded-[2rem] p-4 border border-white/20 shadow-2xl">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-3xl shadow-lg border border-white/30">
              👋
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">Welcome Back</p>
              <p className="text-2xl font-black">{user?.name}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200/60 mt-0.5">{user?.role}</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* 2. KPI Metric Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Compliance Items"
          value={metrics.total}
          icon={FileText}
          variant="primary"
          trend="+5.2%"
          trendPositive={true}
        />
        <MetricCard
          title="Compliance Rate"
          value={`${metrics.complianceRate}%`}
          icon={CheckCircle}
          variant="success"
          trend="+2.1%"
          trendPositive={true}
        />
        <MetricCard
          title="Non-Compliances"
          value={metrics.nonCompliant + metrics.overdue}
          icon={XCircle}
          variant="danger"
          trend="-1.3%"
          trendPositive={false}
        />
        <MetricCard
          title="Upcoming Deadlines"
          value={metrics.upcoming.next30Days}
          icon={Clock}
          variant="warning"
        />
      </section>

      {/* 3. Deadline Insight Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DeadlineInsightCard
          title="Immediate Focus"
          subtitle="Next 7 days (Critical)"
          count={metrics.upcoming.next7Days}
          variant="danger"
        />
        <DeadlineInsightCard
          title="Active Attention"
          subtitle="Next 15 days (Warning)"
          count={metrics.upcoming.next15Days}
          variant="warning"
        />
        <DeadlineInsightCard
          title="Strategic Pipeline"
          subtitle="Next 30 days (Upcoming)"
          count={metrics.upcoming.next30Days}
          variant="info"
        />
      </section>

      {/* Main Analytical Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left 2/3 - Main Analytics */}
        <div className="lg:col-span-2 space-y-8">

          {/* 4. Yearly Compliance Analytics */}
          <Card className="p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
              <div>
                <h2 className="text-xl font-bold dark:text-white">Annual Compliance Momentum</h2>
                <p className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-widest">Yearly Performance Trend</p>
              </div>
              <div className="flex gap-2 p-1 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                <button className="px-4 py-1.5 text-xs font-bold bg-white dark:bg-gray-700 shadow-sm rounded-lg text-indigo-600 dark:text-white">Monthly</button>
                <button className="px-4 py-1.5 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">Quarterly</button>
              </div>
            </div>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    {Object.keys(COLORS).map((key) => (
                      <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS[key]} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={COLORS[key]} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-800" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 13, fontWeight: 500 }}
                    dy={15}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 13, fontWeight: 500 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-[13px] font-semibold text-gray-500 dark:text-gray-400">{value}</span>}
                  />
                  <Area type="monotone" dataKey="Compliant" stackId="1" stroke={COLORS.compliant} fill="url(#grad-compliant)" strokeWidth={3} animationDuration={1500} />
                  <Area type="monotone" dataKey="In Progress" stackId="1" stroke={COLORS.inProgress} fill="url(#grad-inProgress)" strokeWidth={3} animationDuration={1500} />
                  <Area type="monotone" dataKey="Pending" stackId="1" stroke={COLORS.pending} fill="url(#grad-pending)" strokeWidth={3} animationDuration={1500} />
                  <Area type="monotone" dataKey="Overdue" stackId="1" stroke={COLORS.overdue} fill="url(#grad-overdue)" strokeWidth={3} animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* 5. Compliance Growth Indicator */}
            <div className="mt-10 p-6 bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700 rounded-3xl flex flex-col md:flex-row items-center gap-8">
              <div className="shrink-0 space-y-1 text-center md:text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Current Velocity</p>
                <div className="text-4xl font-black text-indigo-600">{metrics.complianceRate}%</div>
                <p className="text-xs font-bold text-emerald-500 flex items-center justify-center md:justify-start gap-1">
                  <TrendingUp size={14} /> +2.4% this month
                </p>
              </div>
              <div className="flex-1 h-20 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <Line
                      type="monotone"
                      dataKey="Rate"
                      stroke="#6366F1"
                      strokeWidth={4}
                      dot={false}
                      activeDot={{ r: 8, fill: '#6366F1', stroke: '#fff', strokeWidth: 4 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* 8. Plant / Region Performance */}
          <Card className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold dark:text-white">Regional Performance Spectrum</h2>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Plant-wise Comparative Analysis</p>
              </div>
              <BarChart3 className="text-gray-300 dark:text-gray-700" size={32} />
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={plantChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" className="dark:stroke-gray-800" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 13, fontWeight: 700 }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} />
                  <Tooltip
                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)', radius: 12 }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white dark:bg-gray-800 border-none rounded-2xl p-5 shadow-2xl">
                            <p className="text-xs font-black text-indigo-500 uppercase mb-1 tracking-widest">{data.name}</p>
                            <p className="text-base font-bold text-gray-900 dark:text-white mb-3">{data.fullName}</p>
                            <div className="flex items-center gap-6">
                              <div className="space-y-1">
                                <p className="text-2xl font-black text-emerald-500">{data.rate}%</p>
                                <p className="text-[9px] uppercase font-bold text-gray-400">Rate</p>
                              </div>
                              <div className="w-px h-8 bg-gray-100 dark:bg-gray-700" />
                              <div className="space-y-1">
                                <p className="text-lg font-bold text-gray-900 dark:text-white">{data.compliant}/{data.total}</p>
                                <p className="text-[9px] uppercase font-bold text-gray-400">Items</p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="rate"
                    radius={[12, 12, 12, 12]}
                    barSize={40}
                    animationDuration={1500}
                  >
                    {plantChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.rate > 90 ? COLORS.compliant : entry.rate > 75 ? '#6366F1' : '#F59E0B'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
              <div className="p-6 bg-emerald-50/50 dark:bg-emerald-500/5 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-emerald-600/60 transition-transform">Top Performer</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white truncate lg:max-w-[150px]">{plantData.sort((a, b) => b.complianceRate - a.complianceRate)[0]?.name}</p>
                  </div>
                </div>
                <div className="text-3xl font-black text-emerald-500">{plantData.sort((a, b) => b.complianceRate - a.complianceRate)[0]?.complianceRate}%</div>
              </div>

              <div className="p-6 bg-rose-50/50 dark:bg-rose-500/5 rounded-3xl border border-rose-100 dark:border-rose-900/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-500/20">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-rose-600/60">Priority Focus</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white truncate lg:max-w-[150px]">{plantData.sort((a, b) => a.complianceRate - b.complianceRate)[0]?.name}</p>
                  </div>
                </div>
                <div className="text-3xl font-black text-rose-500">{plantData.sort((a, b) => a.complianceRate - b.complianceRate)[0]?.complianceRate}%</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 1/3 - Operational Insights */}
        <div className="space-y-8">

          {/* 7. Status Distribution */}
          <Card className="p-8">
            <h2 className="text-lg font-bold dark:text-white mb-8 uppercase tracking-widest text-center">System Integrity</h2>
            <div className="relative h-64 flex items-center justify-center">
              <div className="absolute text-center">
                <p className="text-5xl font-black text-indigo-600 leading-none">{metrics.complianceRate}%</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Overall Health</p>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%" cy="50%"
                    innerRadius={75} outerRadius={100}
                    paddingAngle={8} dataKey="value"
                    stroke="none"
                    animationBegin={200}
                    animationDuration={1500}
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {statusDistribution.map(item => (
                <div key={item.name} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: item.color }} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">{item.name}</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white leading-none">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 6. Category Compliance Breakdown */}
          <Card className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold dark:text-white uppercase tracking-widest">Category Integrity</h2>
              <ChevronRight className="text-gray-300" size={20} />
            </div>

            <div className="space-y-6">
              {categoryData.slice(0, 5).map((cat) => (
                <div key={cat.id} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 transition-colors uppercase tracking-tighter">{cat.name}</span>
                    <span className="text-lg font-black text-gray-900 dark:text-white">{cat.complianceRate}%</span>
                  </div>
                  <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-0.5 border border-gray-50 dark:border-gray-700">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-in-out relative"
                      style={{
                        width: `${cat.complianceRate}%`,
                        backgroundColor: cat.complianceRate >= 90 ? COLORS.compliant : cat.complianceRate >= 75 ? COLORS.pending : COLORS.overdue
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-10 py-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-gray-400 font-bold text-xs uppercase tracking-[0.2em] hover:border-indigo-400 hover:text-indigo-500 transition-all">
              View Full Matrix
            </button>
          </Card>
        </div>
      </div>

      {/* 9 & 10. Secondary Focus - Timeline & Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* 9. Upcoming Deadlines Timeline */}
        <Card className="p-10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-2xl font-black dark:text-white leading-none">Activity Stream</h2>
              <p className="text-sm font-bold text-orange-500 mt-2 uppercase tracking-widest">Upcoming Obligations</p>
            </div>
            <div className="h-14 w-14 rounded-[1.5rem] bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-orange-500 shadow-inner">
              <Clock size={32} />
            </div>
          </div>

          <div className="space-y-8 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-orange-500 before:to-gray-100 dark:before:to-gray-800">
            {upcomingItems.map((item) => {
              const daysUntil = Math.floor((new Date(item.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
              return (
                <div key={item.id} className="relative pl-12 group">
                  <div className="absolute left-[1.125rem] top-1.5 w-3 h-3 rounded-full bg-white dark:bg-gray-950 border-4 border-orange-500 z-10 shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-transform group-hover:scale-150" />

                  <div className="p-6 bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl border border-transparent hover:border-orange-200 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-[10px] font-black uppercase text-orange-600 dark:text-orange-400 rounded-full w-fit">
                        Due in {daysUntil} Day{daysUntil !== 1 ? 's' : ''}
                      </span>
                      <span className="text-xs font-bold text-gray-400 flex items-center gap-2">
                        <CalendarIcon size={14} /> {format(new Date(item.dueDate), 'MMMM dd, yyyy')}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">
                      <span className="px-2 py-0.5 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">{item.plantName}</span>
                      <span className="text-gray-200">•</span>
                      <span>{item.categoryName}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 10. High-Risk / Non-Compliant Items */}
        <Card className="p-10 border-rose-100 dark:border-rose-900/20 relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <AlertCircle size={120} className="text-rose-500" />
          </div>

          <div className="flex items-center justify-between mb-12 relative z-10">
            <div>
              <h2 className="text-2xl font-black dark:text-white leading-none">Exposure Matrix</h2>
              <p className="text-sm font-bold text-rose-500 mt-2 uppercase tracking-widest">High Probability Risks</p>
            </div>
            <div className="h-14 w-14 rounded-[1.5rem] bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-500 shadow-inner">
              <XCircle size={32} />
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            {recentNonCompliant.map(item => (
              <div key={item.id} className="group flex items-center gap-6 p-6 bg-rose-50/30 dark:bg-rose-500/5 rounded-[2rem] border border-rose-100/50 dark:border-rose-900/10 hover:border-rose-500 transition-all duration-500">
                <div className="h-16 w-16 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-500/30 transform group-hover:rotate-6 transition-transform">
                  <AlertCircle size={32} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${item.status === 'overdue' ? 'bg-rose-100 text-rose-600' : 'bg-red-600 text-white'}`}>
                      {item.status}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-gray-400">{item.categoryName}</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white truncate transition-transform group-hover:translate-x-1">{item.title}</h4>
                  <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-widest">{item.plantName}</p>
                </div>
                <button className="h-12 w-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-rose-500 opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100">
                  <ChevronRight size={24} />
                </button>
              </div>
            ))}
          </div>

          <button className="w-full mt-10 py-5 rounded-[2rem] bg-gray-950 dark:bg-white text-white dark:text-gray-950 font-black uppercase tracking-[0.35em] text-xs hover:scale-[1.02] transform transition-all active:scale-95 shadow-2xl">
            Resolution Protocol
          </button>
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;