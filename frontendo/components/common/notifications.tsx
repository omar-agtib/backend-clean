'use client'

import { useEffect } from 'react'
import { uiStore } from '@/store/ui-store'
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react'

export function Notifications() {
  const { notifications, removeNotification } = uiStore()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}

function Toast({
  notification,
  onClose,
}: {
  notification: any
  onClose: () => void
}) {
  useEffect(() => {
    if (notification.duration) {
      const timer = setTimeout(onClose, notification.duration)
      return () => clearTimeout(timer)
    }
  }, [notification.duration, onClose])

  const typeConfig = {
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      icon: CheckCircle,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: AlertCircle,
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: AlertTriangle,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: Info,
    },
  }

  const config = typeConfig[notification.type]
  const Icon = config.icon

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${config.bg} ${config.border} ${config.text} animate-in slide-in duration-200`}
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium">{notification.message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
