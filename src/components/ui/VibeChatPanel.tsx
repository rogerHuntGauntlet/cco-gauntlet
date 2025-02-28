import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface Message {
  id: string;
  sender: 'user' | 'vibe';
  text: string;
  timestamp: Date;
}

interface VibeChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VibeChatPanel({ isOpen, onClose }: VibeChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'vibe',
      text: 'Hi there! I\'m your VIBE assistant. How can I enhance your flow state today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate VIBE assistant response after a short delay
    setTimeout(() => {
      const vibeResponses = [
        "I understand. Let me help you optimize your workflow for that task.",
        "Great question! Here's a technique that might help you get into flow state faster.",
        "I've analyzed your recent patterns. Would you like some suggestions to improve focus?",
        "That's an interesting challenge. Let me suggest a few approaches that might work better.",
        "I'm detecting some resistance in your workflow. Let's try to identify what's blocking you."
      ];
      
      const randomResponse = vibeResponses[Math.floor(Math.random() * vibeResponses.length)];
      
      const vibeMessage: Message = {
        id: Date.now().toString(),
        sender: 'vibe',
        text: randomResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, vibeMessage]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl z-50 flex flex-col border-l border-cco-neutral-200 transition-transform duration-300 ease-in-out transform translate-x-0 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-cco-neutral-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cco-primary-500 to-cco-accent-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
              <path d="M12 12L2 12" />
              <path d="M12 12l4.3-4.3" />
              <path d="M12 12l4.3 4.3" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-cco-neutral-900">VIBE Assistant</h3>
        </div>
        <button 
          onClick={onClose}
          className="p-1 rounded-md text-cco-neutral-700 hover:bg-cco-neutral-100"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cco-neutral-50">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender === 'user' 
                  ? 'bg-cco-primary-500 text-white' 
                  : 'bg-white border border-cco-neutral-200 text-cco-neutral-900'
              }`}
            >
              <p>{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-cco-primary-200' : 'text-cco-neutral-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <form onSubmit={handleSendMessage} className="border-t border-cco-neutral-200 p-4">
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Message VIBE assistant..."
            className="flex-1 px-4 py-2 rounded-md border border-cco-neutral-300 focus:outline-none focus:ring-2 focus:ring-cco-primary-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className={`p-2 rounded-md ${
              inputValue.trim() 
                ? 'bg-cco-primary-500 text-white hover:bg-cco-primary-600' 
                : 'bg-cco-neutral-200 text-cco-neutral-500'
            }`}
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
} 