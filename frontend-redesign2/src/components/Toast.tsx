import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({
  id,
  message,
  type = 'info',
  duration = 5000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 flex-shrink-0 text-success" />,
    error: <AlertCircle className="h-5 w-5 flex-shrink-0 text-error" />,
    warning: <AlertTriangle className="h-5 w-5 flex-shrink-0 text-warning" />,
    info: <Info className="h-5 w-5 flex-shrink-0 text-info" />,
  };

  const bgColors = {
    success: 'bg-success/10 border-success/30',
    error: 'bg-error/10 border-error/30',
    warning: 'bg-warning/10 border-warning/30',
    info: 'bg-info/10 border-info/30',
  };

  const textColors = {
    success: 'text-success',
    error: 'text-error',
    warning: 'text-warning',
    info: 'text-info',
  };

  return (
    <div
      className={`rounded-lg border px-4 py-3 sm:px-4 sm:py-4 shadow-lg flex items-start gap-3 ${bgColors[type]}`}
      role="alert"
    >
      {icons[type]}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${textColors[type]} break-words`}>
          {message}
        </p>
      </div>
      <button
        onClick={() => onClose(id)}
        className={`flex-shrink-0 h-6 w-6 rounded hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center transition-colors duration-200 ${textColors[type]}`}
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<ToastProps & { id: string }>;
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed bottom-0 right-0 z-50 p-3 sm:p-4 w-full sm:w-auto space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
}
