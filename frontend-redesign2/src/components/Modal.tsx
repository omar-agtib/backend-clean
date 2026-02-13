import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeButton = true,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'sm:w-96',
    md: 'sm:w-[540px]',
    lg: 'sm:w-[720px]',
    xl: 'sm:w-[900px]',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className={`relative w-full mx-3 sm:mx-0 rounded-t-xl sm:rounded-lg bg-card border border-border shadow-xl max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-y-auto ${sizeClasses[size]}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Header */}
        {title && (
          <div className="sticky top-0 z-10 border-b border-border bg-card px-4 sm:px-6 py-4 flex items-center justify-between">
            <h2 id="modal-title" className="text-lg sm:text-xl font-semibold text-foreground">
              {title}
            </h2>
            {closeButton && (
              <button
                onClick={onClose}
                className="flex items-center justify-center h-10 w-10 rounded-md hover:bg-muted transition-colors duration-200 flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="sticky bottom-0 border-t border-border bg-card px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
