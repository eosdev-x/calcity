import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className={clsx(
          "relative w-full max-w-4xl bg-surface-container-highest rounded-[28px] elevation-4",
          "transform transition-all duration-[var(--md-sys-motion-duration-medium2)] ease-[var(--md-sys-motion-easing-standard)]",
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-surface-container-high transition-colors duration-[var(--md-sys-motion-duration-short3)]"
          aria-label="Close modal"
        >
          <X className="w-6 h-6 text-on-surface" />
        </button>
        {children}
      </div>
    </div>
  );
}
