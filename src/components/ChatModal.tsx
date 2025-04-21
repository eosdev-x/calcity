import React from 'react';
import { Modal } from './Modal';
import { ChatInterface } from './ChatInterface';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatModal({ isOpen, onClose }: ChatModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      className="min-h-[80vh] md:min-h-[600px] flex flex-col"
    >
      <div className="p-6 pb-4 border-b border-desert-200 dark:border-night-desert-300">
        <h2 className="text-2xl font-semibold text-desert-800 dark:text-desert-100">
          Chat with CalCityBot
        </h2>
        <p className="text-desert-600 dark:text-desert-300 mt-1">
          Ask me anything about California City!
        </p>
      </div>
      <div className="flex-1 p-6">
        <ChatInterface />
      </div>
    </Modal>
  );
}