import React, { useState, useEffect } from 'react';
import { Note } from '../types/Note';
import { subscribeToUserNotes } from '../services/noteService';
import { useAuth } from '../contexts/AuthContext';
import { Sidebar } from '../components/Layout/Sidebar';
import { NotesGrid } from '../components/Notes/NotesGrid';
import { NoteEditor } from '../components/Notes/NoteEditor';
import { Menu } from 'lucide-react';

export const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeToUserNotes(currentUser.uid, (userNotes) => {
      setNotes(userNotes);
    });

    return unsubscribe;
  }, [currentUser]);

  const handleCreateNote = () => {
    setSelectedNote(null);
    setShowEditor(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setSelectedNote(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 transition-colors duration-300">
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsSidebarOpen(true)} 
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-blue-600 text-white shadow-lg"
        aria-label="Open sidebar menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar for desktop */}
        <Sidebar
          onCreateNote={handleCreateNote}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isSidebarOpen={isSidebarOpen}
          onCloseSidebar={() => setIsSidebarOpen(false)}
        />
        
        {/* Main Content */}
        <NotesGrid
          notes={notes}
          onEditNote={handleEditNote}
          searchQuery={searchQuery}
        />
      </div>

      {showEditor && (
        <NoteEditor
          note={selectedNote || undefined}
          onClose={handleCloseEditor}
        />
      )}
    </div>
  );
};