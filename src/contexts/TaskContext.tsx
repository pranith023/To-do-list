import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Task, CreateTaskData } from '../types/Task';
import {
  subscribeToUserTasks,
  createTask,
  updateTask as updateTaskService,
  deleteTask as deleteTaskService,
} from '../services/taskService';

interface TaskContextType {
  tasks: Task[];
  addTask: (title: string, description?: string, category?: string) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  loading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToUserTasks(currentUser.uid, (userTasks) => {
      setTasks(userTasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addTask = async (title: string, description?: string, category?: string) => {
    if (!currentUser) return;
    const newTaskData: CreateTaskData = {
      title,
      userId: currentUser.uid,
      description,
      category,
    };
    await createTask(newTaskData);
  };
  
  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!currentUser) return;
    await updateTaskService(currentUser.uid, taskId, updates);
  };
  
  const deleteTask = async (taskId: string) => {
    if (!currentUser) return;
    await deleteTaskService(currentUser.uid, taskId);
  };

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    loading,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};