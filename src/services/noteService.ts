import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Note, CreateNoteData, UpdateNoteData } from '../types/Note';

const getUserNotesCollectionRef = (userId: string) => {
  return collection(db, 'users', userId, 'notes');
};

const getOldNotesCollectionRef = () => {
  return collection(db, 'notes');
};

export const createNote = async (noteData: CreateNoteData): Promise<string> => {
  const docRef = await addDoc(getUserNotesCollectionRef(noteData.userId), {
    ...noteData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    isPinned: noteData.isPinned || false,
    tags: noteData.tags || [],
  });
  return docRef.id;
};

export const updateNote = async (
  userId: string,
  noteId: string,
  updates: UpdateNoteData
): Promise<void> => {
  const noteRef = doc(db, 'users', userId, 'notes', noteId);
  await updateDoc(noteRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

export const deleteNote = async (userId: string, noteId: string): Promise<void> => {
  const noteRef = doc(db, 'users', userId, 'notes', noteId);
  await deleteDoc(noteRef);
};

export const subscribeToUserNotes = (
  userId: string,
  callback: (notes: Note[]) => void
): (() => void) => {
  const secureQuery = query(
    getUserNotesCollectionRef(userId),
    orderBy('isPinned', 'desc'),
    orderBy('updatedAt', 'desc')
  );

  const oldQuery = query(
    getOldNotesCollectionRef(),
    where('userId', '==', userId),
    orderBy('isPinned', 'desc'),
    orderBy('updatedAt', 'desc')
  );
  
  let newNotes: Note[] = [];
  let oldNotes: Note[] = [];

  const updateUI = () => {
    const combinedNotes = [...newNotes, ...oldNotes].sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
    callback(combinedNotes);
  };
  
  const unsubscribeSecure = onSnapshot(secureQuery, (snapshot) => {
    newNotes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    } as Note));
    updateUI();
  });

  const unsubscribeOld = onSnapshot(oldQuery, (snapshot) => {
    oldNotes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    } as Note));
    updateUI();
  });

  return () => {
    unsubscribeSecure();
    unsubscribeOld();
  };
};