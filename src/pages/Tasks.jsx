import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  Calendar,
  Building2,
  Tag,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  Upload,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import mockData from '../data/mockData';

const Tasks = () => {
  const { getFilteredItems, updateComplianceStatus, addComment, addDocument, user, categories, plants } = useApp();
  const allItems = getFilteredItems();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [plantFilter, setPlantFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Filter and sort items
  const filteredItems = allItems
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || item.category === parseInt(categoryFilter);
      const matchesPlant = plantFilter === 'all' || item.plantId === parseInt(plantFilter);
      const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesPlant && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const getStatusBadge = (status) => {
    const statusConfig = mockData.statusTypes.find(s => s.value === status);
    if (!statusConfig) return null;

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.bgColor} ${statusConfig.textColor}`}>
        {statusConfig.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${colors[priority]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  const getDaysUntilDue = (dueDate) => {
    const days = Math.floor((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { text: `${Math.abs(days)} days overdue`, color: 'text-red-600 dark:text-red-400' };
    if (days === 0) return { text: 'Due today', color: 'text-orange-600 dark:text-orange-400' };
    if (days === 1) return { text: 'Due tomorrow', color: 'text-orange-600 dark:text-orange-400' };
    return { text: `${days} days left`, color: 'text-gray-600 dark:text-gray-400' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Compliance Tasks
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track all compliance activities
          </p>
        </div>

        <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          <span>Export Tasks</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
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
                {mockData.statusTypes.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

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

            {user?.role === 'corporate' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Plant
                </label>
                <select
                  value={plantFilter}
                  onChange={(e) => setPlantFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Plants</option>
                  {plants.map(plant => (
                    <option key={plant.id} value={plant.id}>{plant.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Priorities</option>
                {mockData.priorities.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredItems.length} of {allItems.length} tasks
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredItems.map(item => {
          const daysInfo = getDaysUntilDue(item.dueDate);

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedTask(item)}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Left Side */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start space-x-3">
                    <div className={`mt-1 p-2 rounded-lg ${
                      item.status === 'compliant' ? 'bg-green-100 dark:bg-green-900/30' :
                      item.status === 'overdue' ? 'bg-red-100 dark:bg-red-900/30' :
                      'bg-blue-100 dark:bg-blue-900/30'
                    }`}>
                      {item.status === 'compliant' ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : item.status === 'overdue' ? (
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      ) : (
                        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {getStatusBadge(item.status)}
                        {getPriorityBadge(item.priority)}
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                          {item.categoryName}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Building2 className="w-4 h-4" />
                          <span>{item.plantName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {format(new Date(item.dueDate), 'dd MMM yyyy')}</span>
                          <span className={`font-medium ${daysInfo.color}`}>
                            ({daysInfo.text})
                          </span>
                        </div>
                        {item.documents.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <FileText className="w-4 h-4" />
                            <span>{item.documents.length} document(s)</span>
                          </div>
                        )}
                        {item.comments.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{item.comments.length} comment(s)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Actions */}
                <div className="flex lg:flex-col gap-2">
                  {user?.role === 'plant' && item.status !== 'compliant' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateComplianceStatus(item.id, 'in_progress');
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors whitespace-nowrap"
                    >
                      Start Working
                    </button>
                  )}
                  {user?.role === 'corporate' && item.status === 'submitted' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateComplianceStatus(item.id, 'compliant');
                        }}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors whitespace-nowrap"
                      >
                        Approve
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateComplianceStatus(item.id, 'non_compliant');
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors whitespace-nowrap"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No tasks found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          updateStatus={updateComplianceStatus}
          addComment={addComment}
          addDocument={addDocument}
          user={user}
        />
      )}
    </div>
  );
};

// Task Detail Modal Component
const TaskDetailModal = ({ task, onClose, updateStatus, addComment, addDocument, user }) => {
  const [comment, setComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);

  const handleSubmitComment = () => {
    if (comment.trim()) {
      addComment(task.id, comment);
      setComment('');
      setShowCommentBox(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {task.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {task.description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Task Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Plant</p>
              <p className="font-medium text-gray-900 dark:text-white">{task.plantName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Category</p>
              <p className="font-medium text-gray-900 dark:text-white">{task.categoryName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Due Date</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {format(new Date(task.dueDate), 'dd MMM yyyy')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Priority</p>
              <p className="font-medium text-gray-900 dark:text-white capitalize">{task.priority}</p>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Documents ({task.documents.length})
            </h3>
            {task.documents.length > 0 ? (
              <div className="space-y-2">
                {task.documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{doc.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {doc.size} • Uploaded {format(new Date(doc.uploadedDate), 'dd MMM yyyy')}
                        </p>
                      </div>
                    </div>
                    <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">No documents uploaded yet</p>
            )}
            {user?.role === 'plant' && (
              <button className="mt-3 flex items-center space-x-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                <Upload className="w-4 h-4" />
                <span>Upload Document</span>
              </button>
            )}
          </div>

          {/* Comments */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Comments ({task.comments.length})
            </h3>
            {task.comments.length > 0 ? (
              <div className="space-y-3 mb-3">
                {task.comments.map(comment => (
                  <div key={comment.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{comment.author}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(comment.date), 'dd MMM yyyy HH:mm')}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">No comments yet</p>
            )}

            {!showCommentBox ? (
              <button
                onClick={() => setShowCommentBox(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Add Comment</span>
              </button>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSubmitComment}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => {
                      setShowCommentBox(false);
                      setComment('');
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
