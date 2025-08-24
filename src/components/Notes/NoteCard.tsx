import React from 'react';
import { Pin, Trash2, Edit3 } from 'lucide-react';
import { Note } from '../../types/Note';
import { updateNote, deleteNote } from '../../services/noteService';
import { useAuth } from '../../contexts/AuthContext';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit }) => {
  const { currentUser } = useAuth();
  
  const handleTogglePin = async () => {
    if (!currentUser) return;
    await updateNote(currentUser.uid, note.id, { isPinned: !note.isPinned });
  };

  const handleDelete = async () => {
    if (!currentUser) return;
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(currentUser.uid, note.id);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getPreviewText = (content: string, maxLength: number = 150) => {
    const stripped = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
    return stripped.length > maxLength ? stripped.substring(0, maxLength) + '...' : stripped;
  };

  return (
    <div className="group relative bg-white/10 dark:bg-gray-900/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl cursor-pointer">
      {note.isPinned && (
        <div className="absolute top-4 right-4">
          <Pin className="w-4 h-4 text-yellow-500 fill-current" />
        </div>
      )}

      <div onClick={() => onEdit(note)} className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {note.title || 'Untitled'}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3">
          {getPreviewText(note.content) || 'No content'}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{formatDate(note.updatedAt)}</span>
          {note.tags && note.tags.length > 0 && (
            <div className="flex space-x-1">
              {note.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full text-xs">
                  {tag}
                </span>
              ))}
              {note.tags.length > 2 && (
                <span className="text-gray-500 dark:text-gray-400">+{note.tags.length - 2}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors duration-200"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleTogglePin();
            }}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              note.isPinned
                ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-600 dark:text-yellow-400'
                : 'bg-gray-500/20 hover:bg-gray-500/30 text-gray-600 dark:text-gray-400'
            }`}
          >
            <Pin className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-400 rounded-lg transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};