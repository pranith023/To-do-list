import React, { useState } from 'react';
import { useTasks } from '../../contexts/TaskContext'; // Corrected hook name
import TaskItem from './TaskItem';
import { Search, Filter, ListTodo, CheckCircle, Clock } from 'lucide-react';

export default function TaskList() {
  const { tasks, updateTask, deleteTask } = useTasks();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // ... (rest of the code is correct)

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'pending' && !task.completed) || 
                         (filter === 'completed' && task.completed);
    
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
    
    return matchesSearch && matchesFilter && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(tasks.map(task => task.category)))];
  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <div className="space-y-6 px-4">
      {/* Search and Filter Section */}
      <div className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 rounded-2xl border border-white/20 dark:border-gray-700/20 p-4 sm:p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Filter:</span>
            </div>
            
            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All', icon: ListTodo },
                { key: 'pending', label: 'Pending', icon: Clock },
                { key: 'completed', label: 'Completed', icon: CheckCircle }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filter === key
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                    categoryFilter === category
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 rounded-2xl border border-white/20 dark:border-gray-700/20 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <ListTodo className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{tasks.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 rounded-2xl border border-white/20 dark:border-gray-700/20 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedCount}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 rounded-2xl border border-white/20 dark:border-gray-700/20 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{tasks.length - completedCount}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Remaining</p>
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <ListTodo className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {searchTerm || filter !== 'all' ? 'No tasks found matching your criteria' : 'No tasks yet'}
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              {searchTerm || filter !== 'all' ? 'Try adjusting your search or filters' : 'Click the + button to add your first task'}
            </p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={updateTask}
              onDelete={deleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}