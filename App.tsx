
import React, { useState } from 'react';
import Header from './components/Header';
import ChatView from './components/ChatView';
import ImageView from './components/ImageView';
import { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Chat);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <Header currentView={currentView} setView={setCurrentView} />
      <main className="flex-1 overflow-hidden">
        {currentView === View.Chat ? <ChatView /> : <ImageView />}
      </main>
    </div>
  );
};

export default App;
