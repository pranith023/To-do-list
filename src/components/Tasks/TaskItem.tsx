import React, { useState } from 'react';
import { Task } from '../../contexts/TaskContext';
import { Check, Edit3, Trash2, Calendar } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

const categoryColors = {
  work: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  personal: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  shopping: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  general: 'bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300',
};

export default function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');

  const handleSave = () => {
    if (title.trim()) {
      onUpdate(task.id, { title: title.trim(), description: description.trim() });
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      setTitle(task.title);
      setDescription(task.description || '');
      setIsEditing(false);
    }
  };

  const formatDate = (timestamp: any) => {
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Just now';
    }
  };

  return (
    <div className={`group backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 rounded-2xl border border-white/20 dark:border-gray-700/20 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 ${task.completed ? 'opacity-75' : ''}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
        <button
          onClick={() => onUpdate(task.id, { completed: !task.completed })}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 transform hover:scale-110 ${
            task.completed
              ? 'bg-gradient-to-r from-green-400 to-green-600 border-green-500'
              : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500'
          }`}
        >
          {task.completed && <Check className="w-3 h-3 text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-white text-lg font-medium placeholder-gray-500"
                placeholder="Task title..."
                autoFocus
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none outline-none text-gray-600 dark:text-gray-400 text-sm resize-none placeholder-gray-500"
                placeholder="Add description..."
                rows={2}
              />
            </div>
          ) : (
            <div className="space-y-1">
              <h3 className={`text-lg font-medium transition-all duration-200 ${
                task.completed 
                  ? 'line-through text-gray-500 dark:text-gray-500' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-sm transition-all duration-200 ${
                  task.completed 
                    ? 'line-through text-gray-400 dark:text-gray-600' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {task.description}
                </p>
              )}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${
                    categoryColors[task.category as keyof typeof categoryColors] || categoryColors.general
                  }`}>
                    {task.category}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(task.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2 sm:mt-0">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-all duration-200 transform hover:scale-110"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-all duration-200 transform hover:scale-110"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}