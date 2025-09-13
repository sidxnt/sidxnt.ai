
import React from 'react';
import { View } from '../types';
import { ChatIcon, ImageIcon } from './icons/Icons';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const getButtonClasses = (view: View) => {
    return `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
      currentView === view
        ? 'bg-blue-600 text-white'
        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
    }`;
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700 shadow-md">
      <h1 className="text-2xl font-bold tracking-wider text-white">
        sidxnt<span className="text-blue-500">.ai</span>
      </h1>
      <nav className="flex items-center gap-4">
        <button onClick={() => setView(View.Chat)} className={getButtonClasses(View.Chat)}>
          <ChatIcon className="w-5 h-5" />
          <span>Chat</span>
        </button>
        <button onClick={() => setView(View.Image)} className={getButtonClasses(View.Image)}>
          <ImageIcon className="w-5 h-5" />
          <span>Image</span>
        </button>
      </nav>
    </header>
  );
};

export default Header;
