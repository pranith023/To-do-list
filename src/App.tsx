// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Import Toaster
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { TaskProvider } from './contexts/TaskContext';
import { AuthPage } from './pages/AuthPage';
import { NotesPage } from './pages/NotesPage';

const AppRoutes: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={currentUser ? <Navigate to="/notes" /> : <Navigate to="/auth" />} 
      />
      <Route 
        path="/auth" 
        element={currentUser ? <Navigate to="/notes" /> : <AuthPage />} 
      />
      <Route 
        path="/notes" 
        element={currentUser ? <NotesPage /> : <Navigate to="/auth" />} 
      />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <Router>
            <AppRoutes />
          </Router>
        </TaskProvider>
      </AuthProvider>
      <Toaster /> // Add Toaster component here
    </ThemeProvider>
  );
}

export default App;