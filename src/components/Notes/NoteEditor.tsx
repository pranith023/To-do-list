import React, { useState, useEffect } from 'react';
import { Save, X, Pin, Calendar, Tag } from 'lucide-react';
import { Note, CreateNoteData, UpdateNoteData } from '../../types/Note';
import { createNote, updateNote } from '../../services/noteService';
import { useAuth } from '../../contexts/AuthContext';

interface NoteEditorProps {
  note?: Note;
  onClose: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, onClose }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [isPinned, setIsPinned] = useState(note?.isPinned || false);
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const { currentUser } = useAuth();

  // Auto-save functionality
  useEffect(() => {
    if (!note || !currentUser) return;

    const saveTimer = setTimeout(async () => {
      if (title !== note.title || content !== note.content || isPinned !== note.isPinned) {
        setAutoSaving(true);
        try {
          await updateNote(currentUser.uid, note.id, { title, content, isPinned, tags });
          setLastSaved(new Date());
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
        setAutoSaving(false);
      }
    }, 2000);

    return () => clearTimeout(saveTimer);
  }, [title, content, isPinned, tags, note, currentUser]);

  const handleSave = async () => {
    if (!currentUser) return;

    setSaving(true);
    try {
      if (note) {
        const updates: UpdateNoteData = { title, content, isPinned, tags };
        await updateNote(currentUser.uid, note.id, updates);
      } else {
        const newNote: CreateNoteData = {
          title: title || 'Untitled',
          content,
          userId: currentUser.uid,
          isPinned,
          tags
        };
        await createNote(newNote);
      }
      setLastSaved(new Date());
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
    }
    setSaving(false);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Saved just now';
    if (minutes === 1) return 'Saved 1 minute ago';
    if (minutes < 60) return `Saved ${minutes} minutes ago`;
    
    return `Saved at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-lg rounded-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="text-2xl font-bold bg-transparent border-none outline-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 flex-1"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              {autoSaving && <span className="animate-pulse">Saving...</span>}
              {lastSaved && !autoSaving && <span>{formatLastSaved(lastSaved)}</span>}
            </div>
            
            <button
              onClick={() => setIsPinned(!isPinned)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isPinned
                  ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                  : 'bg-gray-500/20 text-gray-600 dark:text-gray-400 hover:bg-gray-500/30'
              }`}
            >
              <Pin className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-600 dark:text-gray-400 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="px-6 py-3 border-b border-white/10">
          <div className="flex items-center space-x-2 mb-2">
            <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tags (press Enter)..."
              className="bg-transparent border-none outline-none text-sm text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 flex-1"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center bg-blue-500/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-2 hover:text-red-500 transition-colors duration-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your note..."
            className="w-full h-full bg-transparent border-none outline-none resize-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg leading-relaxed"
            autoFocus
          />
        </div>

        {/* Footer */}
        {note && (
          <div className="px-6 py-3 border-t border-white/10">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Created {note.createdAt.toLocaleDateString()}</span>
                </div>
                <span>•</span>
                <span>Last modified {note.updatedAt.toLocaleString()}</span>
              </div>
              <div>
                {content.split(/\s+/).filter(word => word.length > 0).length} words
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};