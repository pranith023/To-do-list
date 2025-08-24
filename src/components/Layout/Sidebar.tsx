import React from 'react';
import { User, LogOut, Settings, Moon, Sun, PlusCircle, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarProps {
  onCreateNote: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCreateNote, searchQuery, onSearchChange }) => {
  const { currentUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="w-80 bg-white/5 dark:bg-gray-900/5 backdrop-blur-lg border-r border-white/10 flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Notes</h1>
        </div>

        <button
          onClick={onCreateNote}
          className="w-full flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 mb-6"
        >
          <PlusCircle className="w-5 h-5" />
          <span>New Note</span>
        </button>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-gray-300/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex-1"></div>

      <div className="p-6 border-t border-white/10">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
              {currentUser?.displayName || currentUser?.email}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currentUser?.email}
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={toggleTheme}
            className="flex-1 flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-gray-300/20 px-3 py-2 rounded-lg transition-all duration-200"
          >
            {isDark ? <Sun className="w-4 h-4 text-gray-600 dark:text-gray-300" /> : <Moon className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
          </button>
          
          <button
            className="flex-1 flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-gray-300/20 px-3 py-2 rounded-lg transition-all duration-200"
          >
            <Settings className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>

          <button
            onClick={logout}
            className="flex-1 flex items-center justify-center space-x-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-2 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
};