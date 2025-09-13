
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { startChat } from '../services/geminiService';
import { ChatMessage, Sender } from '../types';
import { SendIcon, UserIcon, SparklesIcon } from './icons/Icons';
import type { Chat } from '@google/genai';
import { v4 as uuidv4 } from 'uuid';

const ChatView: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChat(startChat());
    setMessages([
      {
        id: 'initial-message',
        sender: Sender.AI,
        text: "Hello! I'm Sid, your creative assistant. How can I help you today?",
      },
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || !chat || isLoading) return;

    const userMessage: ChatMessage = { id: uuidv4(), sender: Sender.User, text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiMessageId = uuidv4();
    setMessages((prev) => [...prev, { id: aiMessageId, sender: Sender.AI, text: '' }]);

    try {
      const stream = await chat.sendMessageStream({ message: input });
      let streamedText = '';
      for await (const chunk of stream) {
        streamedText += chunk.text;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId ? { ...msg, text: streamedText } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId ? { ...msg, text: 'Sorry, something went wrong. Please try again.' } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [input, chat, isLoading]);

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && messages[messages.length-1].sender === Sender.AI && <TypingIndicator />}
        </div>
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message here..."
            className="w-full py-3 pl-4 pr-12 text-white bg-gray-700 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface MessageBubbleProps {
    message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isUser = message.sender === Sender.User;
    
    return (
        <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
            {!isUser && (
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                    <SparklesIcon className="w-6 h-6 text-white"/>
                </div>
            )}
            <div className={`max-w-xl px-5 py-3 rounded-2xl shadow-md prose prose-invert prose-p:my-0 ${isUser ? 'bg-blue-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
                 <p>{message.text}</p>
            </div>
             {isUser && (
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-600 rounded-full">
                    <UserIcon className="w-6 h-6 text-gray-300"/>
                </div>
            )}
        </div>
    );
};


const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-2">
     <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
        <SparklesIcon className="w-6 h-6 text-white"/>
    </div>
    <div className="flex items-center space-x-1 p-3 bg-gray-700 rounded-2xl rounded-bl-none">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
  </div>
);

export default ChatView;
