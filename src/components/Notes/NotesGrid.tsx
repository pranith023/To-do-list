import React from 'react';
import { FileText } from 'lucide-react';
import { Note } from '../../types/Note';
import { NoteCard } from './NoteCard';

interface NotesGridProps {
  notes: Note[];
  onEditNote: (note: Note) => void;
  searchQuery: string;
}

export const NotesGrid: React.FC<NotesGridProps> = ({ notes, onEditNote, searchQuery }) => {
  const filteredNotes = notes.filter(note => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      (note.tags && note.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  });

  const pinnedNotes = filteredNotes.filter(note => note.isPinned);
  const regularNotes = filteredNotes.filter(note => !note.isPinned);

  if (filteredNotes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            {searchQuery ? 'No notes found' : 'No notes yet'}
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            {searchQuery ? 'Try adjusting your search terms' : 'Create your first note to get started'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-auto">
      {pinnedNotes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
            Pinned Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pinnedNotes.map(note => (
              <NoteCard key={note.id} note={note} onEdit={onEditNote} />
            ))}
          </div>
        </div>
      )}

      {regularNotes.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            All Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {regularNotes.map(note => (
              <NoteCard key={note.id} note={note} onEdit={onEditNote} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};