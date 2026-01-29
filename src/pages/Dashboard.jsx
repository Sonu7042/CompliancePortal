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
        <h4 className="text-lg font- text-gray-900 dark:text-white">{subtitle}</h4>
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
          <Card className="relative rounded-[28px] bg-white dark:bg-gray-900 p-8 border border-gray-200 dark:border-gray-800 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.18)]">

  {/* Header */}
  <div className="flex items-center justify-between mb-8">
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Compliance Trend
      </h2>
      <p className="text-xs text-gray-400 mt-1">
        Rolling 12-month performance
      </p>
    </div>

    <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
      Live
    </span>
  </div>

  {/* Chart */}
  <div className="h-[320px]">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>

        {/* Gradient */}
        <defs>
          <linearGradient id="modernGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366F1" stopOpacity={0.35} />
            <stop offset="80%" stopColor="#6366F1" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Axis */}
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#9CA3AF", fontSize: 12 }}
          dy={12}
        />
        <YAxis hide />

        {/* Tooltip */}
        <Tooltip
          cursor={{ stroke: "#6366F1", strokeDasharray: "4 6" }}
          content={<CustomTooltip />}
        />

        {/* Line + Area */}
        <Area
          type="monotone"
          dataKey="Compliant"
          stroke="#6366F1"
          strokeWidth={3}
          fill="url(#modernGradient)"
          dot={false}
          activeDot={{ r: 7, fill: "#6366F1", stroke: "#fff", strokeWidth: 3 }}
          animationDuration={1400}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>

  {/* Footer Insight */}
  <div className="mt-6 flex items-center justify-between text-sm">
    <p className="text-gray-400">Average compliance</p>
    <p className="font-semibold text-emerald-500">+12.6%</p>
  </div>
</Card>


          {/* 8. Plant / Region Performance */}
          <Card className="rounded-3xl border border-gray-200/60 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl p-6">

  {/* Header */}
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Regional Performance Spectrum
      </h2>
      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mt-1">
        Plant-wise Comparative Analysis
      </p>
    </div>

    <div className="h-10 w-10 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
      <BarChart3 size={18} />
    </div>
  </div>

  {/* Chart */}
  <div className="h-[320px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={plantChartData}
        margin={{ top: 10, right: 10, left: -10, bottom: 10 }}
      >

        {/* Ultra-soft grid */}
        <CartesianGrid
          vertical={false}
          strokeDasharray="2 6"
          stroke="#E5E7EB"
          className="dark:stroke-gray-800"
        />

        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 600 }}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }}
          domain={[0, 100]}
        />

        {/* Modern Tooltip */}
        <Tooltip
          cursor={{ fill: 'rgba(99,102,241,0.04)', radius: 16 }}
          content={({ active, payload }) => {
            if (active && payload?.length) {
              const d = payload[0].payload;
              return (
                <div className="rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl px-4 py-3 shadow-xl border border-gray-200 dark:border-gray-800">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-indigo-500">
                    {d.name}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    {d.fullName}
                  </p>

                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xl font-bold text-emerald-500">
                        {d.rate}%
                      </p>
                      <p className="text-[9px] uppercase text-gray-400">
                        Compliance
                      </p>
                    </div>
                    <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {d.compliant}/{d.total}
                      </p>
                      <p className="text-[9px] uppercase text-gray-400">
                        Items
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />

        {/* Bars */}
        <Bar
          dataKey="rate"
          barSize={28}
          radius={[999, 999, 999, 999]}
          animationDuration={1200}
        >
          {plantChartData.map((entry, index) => (
            <Cell
              key={index}
              fill={
                entry.rate > 90
                  ? 'url(#good)'
                  : entry.rate > 75
                  ? 'url(#mid)'
                  : 'url(#bad)'
              }
            />
          ))}
        </Bar>

        {/* Gradients */}
        <defs>
          <linearGradient id="good" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <linearGradient id="mid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
          <linearGradient id="bad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Summary Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
    {/* Top */}
    <div className="flex items-center justify-between p-4 rounded-2xl border border-emerald-200/40 dark:border-emerald-900/30 bg-emerald-50/40 dark:bg-emerald-500/5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
          <TrendingUp size={18} />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest font-semibold text-emerald-600/70">
            Top Performer
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[140px]">
            {plantData.sort((a,b)=>b.complianceRate-a.complianceRate)[0]?.name}
          </p>
        </div>
      </div>
      <p className="text-2xl font-bold text-emerald-500">
        {plantData.sort((a,b)=>b.complianceRate-a.complianceRate)[0]?.complianceRate}%
      </p>
    </div>

    {/* Focus */}
    <div className="flex items-center justify-between p-4 rounded-2xl border border-rose-200/40 dark:border-rose-900/30 bg-rose-50/40 dark:bg-rose-500/5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-md">
          <AlertCircle size={18} />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest font-semibold text-rose-600/70">
            Priority Focus
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[140px]">
            {plantData.sort((a,b)=>a.complianceRate-b.complianceRate)[0]?.name}
          </p>
        </div>
      </div>
      <p className="text-2xl font-bold text-rose-500">
        {plantData.sort((a,b)=>a.complianceRate-b.complianceRate)[0]?.complianceRate}%
      </p>
    </div>
  </div>

</Card>

          
        </div>

        {/* Right 1/3 - Operational Insights */}
        <div className="space-y-8">

          {/* 7. Status Distribution */}
          <Card className="p-8">
            <h2 className="text-lg font-mono dark:text-white mb-8 uppercase tracking-widest text-center">System Integrity</h2>
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
                    <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider leading-none mb-1">{item.name}</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white leading-none">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 6. Category Compliance Breakdown */}
          <Card className="rounded-3xl border border-gray-200/60 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl p-6">
  
  {/* Header */}
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-800 dark:text-gray-200">
      Category Integrity
    </h2>
    <ChevronRight className="text-gray-300 dark:text-gray-600" size={18} />
  </div>

  {/* Bars */}
  <div className="space-y-5">
    {categoryData.slice(0, 5).map((cat) => (
      <div key={cat.id} className="group">
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-[13px] font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-500 transition-colors">
            {cat.name}
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {cat.complianceRate}%
          </span>
        </div>

        {/* Track */}
        <div className="relative h-2.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out relative"
            style={{
              width: `${cat.complianceRate}%`,
              background:
                cat.complianceRate >= 90
                  ? 'linear-gradient(to right, rgba(52,211,153,0.6), rgba(16,185,129,0.6))'
                  : cat.complianceRate >= 75
                  ? 'linear-gradient(to right, rgba(251,191,36,0.6), rgba(245,158,11,0.6))'
                  : 'linear-gradient(to right, rgba(244,63,94,0.6), rgba(225,29,72,0.6))'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent" />
          </div>
        </div>

      </div>
    ))}
  </div>

  {/* CTA */}
  <button className="w-full mt-8 py-3 rounded-2xl border border-dashed border-gray-300/70 dark:border-gray-700 text-[11px] font-medium uppercase tracking-[0.25em] text-gray-400 hover:text-indigo-500 hover:border-indigo-400 transition-all">
    View Full Matrix
  </button>
</Card>

        </div>
      </div>

      {/* 9 & 10. Secondary Focus - Timeline & Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* 9. Upcoming Deadlines Timeline */}
        <Card className="relative overflow-hidden rounded-3xl border border-gray-200/60 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl p-6">
  
  {/* Header */}
  <div className="flex items-center justify-between mb-8">
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Activity Stream
      </h2>
      <p className="text-[11px] font-medium text-orange-500 uppercase tracking-wider mt-1">
        Upcoming Obligations
      </p>
    </div>

    <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-orange-400/20 to-orange-600/20 dark:from-orange-500/20 dark:to-orange-700/30 flex items-center justify-center text-orange-500">
      <Clock size={20} />
    </div>
  </div>

  {/* Timeline */}
  <div className="relative space-y-6 before:absolute before:left-[14px] before:top-1 before:bottom-1 before:w-px before:bg-gradient-to-b before:from-orange-500 before:to-transparent">
    {upcomingItems.map((item) => {
      const daysUntil = Math.floor(
        (new Date(item.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
      );

      return (
        <div key={item.id} className="relative pl-10 group">
          
          {/* Dot */}
          <div className="absolute left-[8px] top-2 h-3 w-3 rounded-full bg-white dark:bg-gray-900 border-2 border-orange-500 shadow-sm group-hover:scale-125 transition-transform" />

          {/* Item Card */}
          <div className="rounded-2xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-700/40 p-4 hover:border-orange-300/60 transition-all">
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-100/70 dark:bg-orange-900/30 px-2 py-0.5 rounded-full">
                Due in {daysUntil} day{daysUntil !== 1 && "s"}
              </span>

              <span className="flex items-center gap-1 text-[11px] font-medium text-gray-400">
                <CalendarIcon size={12} />
                {format(new Date(item.dueDate), "MMM dd, yyyy")}
              </span>
            </div>

            <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-2 leading-snug group-hover:text-orange-600 transition-colors">
              {item.title}
            </h4>

            <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              <span className="px-2 py-0.5 bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700">
                {item.plantName}
              </span>
              <span className="opacity-40">•</span>
              <span>{item.categoryName}</span>
            </div>

          </div>
        </div>
      );
    })}
  </div>
</Card>


        {/* 10. High-Risk / Non-Compliant Items */}
        <Card className="relative rounded-3xl border border-rose-200/40 dark:border-rose-900/30 bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl p-6 overflow-hidden">

  {/* Decorative icon */}
  {/* <div className="absolute -top-6 -right-6 opacity-[0.06] pointer-events-none">
    <AlertCircle size={140} className="text-rose-500" />
  </div> */}

  {/* Header */}
  <div className="relative z-10 flex items-center justify-between mb-8">
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Exposure Matrix
      </h2>
      <p className="text-[11px] font-medium text-rose-500 uppercase tracking-wider mt-1">
        High Probability Risks
      </p>
    </div>

    <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-rose-400/20 to-rose-600/30 dark:from-rose-500/20 dark:to-rose-700/30 flex items-center justify-center text-rose-500">
      <XCircle size={20} />
    </div>
  </div>

  {/* Risk List */}
  <div className="relative z-10 space-y-3">
    {recentNonCompliant.map(item => (
      <div
        key={item.id}
        className="group flex items-center gap-4 p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-500/5 border border-rose-200/40 dark:border-rose-900/30 hover:border-rose-500/60 transition-all"
      >

        {/* Icon */}
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:rotate-3 transition-transform">
          <AlertCircle size={20} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full
                ${item.status === 'overdue'
                  ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400'
                  : 'bg-red-600 text-white'
                }`}
            >
              {item.status}
            </span>

            <span className="text-[10px] font-medium uppercase text-gray-400">
              {item.categoryName}
            </span>
          </div>

          <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-rose-600 transition-colors">
            {item.title}
          </h4>

          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mt-0.5">
            {item.plantName}
          </p>
        </div>

        {/* Action */}
        <button className="h-9 w-9 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-rose-500 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
          <ChevronRight size={16} />
        </button>
      </div>
    ))}
  </div>

  {/* CTA */}
  <button className="relative z-10 w-full mt-8 py-4 rounded-2xl bg-gray-950 dark:bg-white text-white dark:text-gray-950 text-[11px] font-semibold uppercase tracking-[0.3em] hover:scale-[1.02] transition-transform active:scale-95 shadow-xl">
    Resolution Protocol
  </button>
</Card>


      </div>
    </div>
  );
};

export default Dashboard;