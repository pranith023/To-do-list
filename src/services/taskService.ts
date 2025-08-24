import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase'; // Corrected import path
import { Task, CreateTaskData, UpdateTaskData } from '../types/Task';

const getUserTasksCollectionRef = (userId: string) => {
  return collection(db, 'users', userId, 'tasks');
};

export const subscribeToUserTasks = (
  userId: string,
  callback: (tasks: Task[]) => void
): (() => void) => {
  const q = query(
    getUserTasksCollectionRef(userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const tasks: Task[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      tasks.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as Task);
    });
    callback(tasks);
  });
};

export const createTask = async (taskData: CreateTaskData): Promise<string> => {
  const docRef = await addDoc(getUserTasksCollectionRef(taskData.userId), {
    ...taskData,
    completed: false,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateTask = async (
  userId: string,
  taskId: string,
  updates: UpdateTaskData
): Promise<void> => {
  const taskRef = doc(db, 'users', userId, 'tasks', taskId);
  await updateDoc(taskRef, {
    ...updates,
  });
};

export const deleteTask = async (userId: string, taskId: string): Promise<void> => {
  const taskRef = doc(db, 'users', userId, 'tasks', taskId);
  await deleteDoc(taskRef);
};