import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Minimize2, Maximize2 } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { clsx } from 'clsx';

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);

  // Handle escape key to close chat
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsMinimized(true);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(!isMinimized);
  };

  const minimizeChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(true);
  };

  const maximizeChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={clsx(
          'flex items-center gap-2 rounded-full bg-desert-400 text-white p-4',
          'hover:bg-desert-500 transition-colors duration-200',
          'shadow-lg hover:shadow-xl',
          { 'hidden': isOpen && !isMinimized }
        )}
        aria-label="Open chat"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={clsx(
            'bg-white dark:bg-night-desert-200 rounded-lg shadow-2xl',
            'transition-all duration-300 ease-in-out',
            'w-[400px] max-w-[calc(100vw-2rem)]',
            {
              'h-[600px] max-h-[calc(100vh-4rem)]': !isMinimized,
              'h-12': isMinimized
            }
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-desert-200 dark:border-night-desert-300">
            <h2 className="font-semibold text-desert-800 dark:text-desert-100">
              Chat with CalCityBot
            </h2>
            <div className="flex items-center gap-2">
              {isMinimized ? (
                <button
                  onClick={maximizeChat}
                  className="p-1 hover:bg-desert-100 dark:hover:bg-night-desert-400 rounded-full transition-colors"
                  aria-label="Maximize chat"
                >
                  <Maximize2 className="w-4 h-4 text-desert-600 dark:text-desert-300" />
                </button>
              ) : (
                <button
                  onClick={minimizeChat}
                  className="p-1 hover:bg-desert-100 dark:hover:bg-night-desert-400 rounded-full transition-colors"
                  aria-label="Minimize chat"
                >
                  <Minimize2 className="w-4 h-4 text-desert-600 dark:text-desert-300" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-desert-100 dark:hover:bg-night-desert-400 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4 text-desert-600 dark:text-desert-300" />
              </button>
            </div>
          </div>

          {/* Chat Interface */}
          {!isMinimized && (
            <div className="h-[calc(100%-4rem)]">
              <ChatInterface />
            </div>
          )}
        </div>
      )}
    </div>
  );
}