import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    onClick();
    setTimeout(() => setIsClicked(false), 200);
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 z-50 group ${
        isClicked ? 'scale-95' : ''
      }`}
      aria-label="Add new task"
    >
      <Plus className={`w-8 h-8 mx-auto transition-transform duration-200 ${
        isClicked ? 'rotate-90' : 'group-hover:rotate-90'
      }`} />
      
      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-active:scale-100 transition-transform duration-200" />
      
      {/* Pulsing ring */}
      <div className="absolute -inset-2 rounded-full border-2 border-blue-400/30 scale-0 group-hover:scale-100 transition-all duration-300 animate-pulse" />
    </button>
  );
}