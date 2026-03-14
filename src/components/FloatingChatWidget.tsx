import React, { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { clsx } from 'clsx';
import { siteConfig } from '../config/site';

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  // Handle escape key to close chat
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
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
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={clsx(
          'flex items-center gap-2 rounded-full bg-primary text-on-primary p-4 elevation-2',
          'hover:bg-primary/90 transition-colors duration-[var(--md-sys-motion-duration-short3)]',
          { 'hidden': isOpen }
        )}
        aria-label="Open chat"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={clsx(
            'bg-surface-container-highest rounded-[28px] elevation-4',
            'transition-all duration-[var(--md-sys-motion-duration-medium2)] ease-[var(--md-sys-motion-easing-standard)]',
            'w-[400px] max-w-[calc(100vw-2rem)]',
            'h-[600px] max-h-[calc(100vh-4rem)]'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-outline-variant">
            <h2 className="font-semibold text-on-surface">
              Chat with {siteConfig.chatBotName}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-surface-container-high rounded-full transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                aria-label="Close chat"
              >
                <X className="w-4 h-4 text-on-surface-variant" />
              </button>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="h-[calc(100%-4rem)]">
            <ChatInterface />
          </div>
        </div>
      )}
    </div>
  );
}
