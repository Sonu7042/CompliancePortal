import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Filter,
  Download
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday
} from 'date-fns';

const Calendar = () => {
  const { getFilteredItems, categories, user } = useApp();
  const items = getFilteredItems();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Get compliance items for a specific date
  const getItemsForDate = (date) => {
    return items.filter(item => {
      const itemDate = new Date(item.dueDate);
      const matchesDate = isSameDay(itemDate, date);
      const matchesCategory = categoryFilter === 'all' || item.category === parseInt(categoryFilter);
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

      return matchesDate && matchesCategory && matchesStatus;
    });
  };

  // Get status color for date
  const getDateStatus = (date) => {
    const dayItems = getItemsForDate(date);
    if (dayItems.length === 0) return 'none';

    const hasOverdue = dayItems.some(item => item.status === 'overdue');
    const hasNonCompliant = dayItems.some(item => item.status === 'non_compliant');
    const hasPending = dayItems.some(item => item.status === 'pending');
    const allCompliant = dayItems.every(item => item.status === 'compliant');

    if (hasOverdue || hasNonCompliant) return 'critical';
    if (hasPending) return 'warning';
    if (allCompliant) return 'success';
    return 'info';
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  };

  const days = generateCalendarDays();
  const selectedDateItems = getItemsForDate(selectedDate);

  const statusColors = {
    critical: 'bg-red-100 dark:bg-red-900/30 border-red-500',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500',
    success: 'bg-green-100 dark:bg-green-900/30 border-green-500',
    info: 'bg-blue-100 dark:bg-blue-900/30 border-blue-500',
    none: ''
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Compliance Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View compliance deadlines and schedules
          </p>
        </div>

        <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          <span>Export Calendar</span>
        </button>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Month Navigation */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
            </div>

            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            <button
              onClick={() => setCurrentMonth(new Date())}
              className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors text-sm font-medium"
            >
              Today
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="overdue">Overdue</option>
                <option value="compliant">Compliant</option>
              </select>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300">Critical (Overdue/Non-Compliant)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-500 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300">Warning (Pending)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 border-2 border-green-500 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300">Compliant</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div
              key={day}
              className="p-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 border-t border-gray-200 dark:border-gray-700">
          {days.map((day, index) => {
            const dayItems = getItemsForDate(day);
            const status = getDateStatus(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = isSameDay(day, selectedDate);
            const isTodayDate = isToday(day);

            return (
              <div
                key={index}
                onClick={() => setSelectedDate(day)}
                className={`min-h-[100px] p-2 border-r border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  !isCurrentMonth ? 'bg-gray-50 dark:bg-gray-900' : ''
                } ${isSelected ? 'ring-2 ring-indigo-500 ring-inset' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-sm font-medium ${
                      !isCurrentMonth
                        ? 'text-gray-400 dark:text-gray-600'
                        : isTodayDate
                        ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                  {isTodayDate && (
                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                  )}
                </div>

                {dayItems.length > 0 && (
                  <div className="space-y-1">
                    {dayItems.slice(0, 2).map(item => (
                      <div
                        key={item.id}
                        className={`text-xs p-1 rounded border-l-2 ${statusColors[status]} truncate`}
                      >
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {item.title}
                        </p>
                      </div>
                    ))}
                    {dayItems.length > 2 && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        +{dayItems.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDateItems.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Compliance Items for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>

          <div className="space-y-4">
            {selectedDateItems.map(item => (
              <div
                key={item.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h4>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      item.status === 'compliant'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : item.status === 'overdue'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : item.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}
                  >
                    {item.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{item.plantName}</span>
                  <span>•</span>
                  <span>{item.categoryName}</span>
                  <span>•</span>
                  <span className="capitalize">{item.priority} Priority</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State for Selected Date */}
      {selectedDateItems.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No compliance items
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No compliance items scheduled for {format(selectedDate, 'MMMM d, yyyy')}
          </p>
        </div>
      )}
    </div>
  );
};

export default Calendar;
