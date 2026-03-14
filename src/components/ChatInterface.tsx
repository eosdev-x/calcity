import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { Message } from '../api/types';
import { sendChatMessage } from '../api/chat';
import { siteConfig } from '../config/site';

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastRequestTime = useRef<number>(0);
  const MIN_REQUEST_INTERVAL = 1000; // 1 second rate limit

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = Date.now();
    if (now - lastRequestTime.current < MIN_REQUEST_INTERVAL) {
      setError('Please wait a moment before sending another message.');
      return;
    }

    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput('');
    setError(null);
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    lastRequestTime.current = now;

    try {
      const { response } = await sendChatMessage([
        ...messages,
        { role: 'user', content: userMessage }
      ]);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setError('Failed to get response. Please try again.');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={clsx(
              'flex',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={clsx(
                'max-w-[80%] rounded-xl p-3',
                message.role === 'user'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface'
              )}
            >
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                className="prose max-w-none"
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-surface-container rounded-xl p-3">
              <Loader2 className="w-5 h-5 animate-spin text-on-surface-variant" />
            </div>
          </div>
        )}
        {error && (
          <div className="text-error text-center text-sm">{error}</div>
        )}
      </div>
      <form 
        onSubmit={handleSubmit}
        className="border-t border-outline-variant p-4 bg-surface-container"
      >
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${siteConfig.city}...`}
            className="flex-1 px-4 py-2 rounded-xl border border-outline bg-surface-container-high text-on-surface 
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={clsx(
              'px-4 py-2 rounded-xl',
              'bg-primary text-on-primary',
              'hover:bg-primary/90',
              'transition-colors duration-[var(--md-sys-motion-duration-short3)]',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
