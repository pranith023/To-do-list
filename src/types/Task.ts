export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  category?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  userId: string;
  category?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  completed?: boolean;
}