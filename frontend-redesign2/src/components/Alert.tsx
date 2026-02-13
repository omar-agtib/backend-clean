import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  actions?: React.ReactNode;
}

export default function Alert({
  type = 'info',
  title,
  message,
  onClose,
  actions,
}: AlertProps) {
  const icons = {
    success: <CheckCircle className="h-5 w-5 flex-shrink-0" />,
    error: <AlertCircle className="h-5 w-5 flex-shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 flex-shrink-0" />,
    info: <Info className="h-5 w-5 flex-shrink-0" />,
  };

  const styles = {
    success: 'bg-success/10 border-success/30 text-success',
    error: 'bg-error/10 border-error/30 text-error',
    warning: 'bg-warning/10 border-warning/30 text-warning',
    info: 'bg-info/10 border-info/30 text-info',
  };

  const textColors = {
    success: 'text-success',
    error: 'text-error',
    warning: 'text-warning',
    info: 'text-info',
  };

  return (
    <div
      className={`rounded-lg border px-4 py-4 ${styles[type]}`}
      role="alert"
    >
      <div className="flex gap-3">
        <div className={`flex-shrink-0 ${textColors[type]}`}>
          {icons[type]}
        </div>

        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={`font-semibold text-sm mb-1 ${textColors[type]}`}>
              {title}
            </h3>
          )}
          <p className={`text-sm ${textColors[type]}`}>
            {message}
          </p>
          {actions && (
            <div className="mt-3 flex gap-2 flex-wrap">
              {actions}
            </div>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className={`flex-shrink-0 h-6 w-6 rounded hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center transition-colors duration-200 ${textColors[type]}`}
            aria-label="Close alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
