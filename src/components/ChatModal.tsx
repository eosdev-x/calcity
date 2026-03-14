import React from 'react';
import { Modal } from './Modal';
import { ChatInterface } from './ChatInterface';
import { siteConfig } from '../config/site';

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
      <div className="p-6 pb-4 border-b border-outline-variant">
        <h2 className="text-2xl font-semibold text-on-surface">
          Chat with {siteConfig.chatBotName}
        </h2>
        <p className="text-on-surface-variant mt-1">
          Ask me anything about {siteConfig.city}!
        </p>
      </div>
      <div className="flex-1 p-6">
        <ChatInterface />
      </div>
    </Modal>
  );
}
