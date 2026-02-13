import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function formatDate(date: string | Date, format = 'MMM DD, YYYY'): string {
  return dayjs(date).format(format)
}

export function formatDateTime(date: string | Date, format = 'MMM DD, YYYY HH:mm'): string {
  return dayjs(date).format(format)
}

export function formatRelativeTime(date: string | Date): string {
  return dayjs(date).fromNow()
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatNumber(num: number, decimals = 0): string {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return formatNumber(bytes / Math.pow(k, i), 2) + ' ' + sizes[i]
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function truncateText(text: string, length = 50): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export function getStatusColor(
  status: string
): 'success' | 'warning' | 'danger' | 'info' | 'default' {
  const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    active: 'success',
    completed: 'success',
    paid: 'success',
    resolved: 'success',
    closed: 'success',
    'in-progress': 'info',
    'in-use': 'info',
    issued: 'info',
    pending: 'warning',
    'in-maintenance': 'warning',
    maintenance: 'warning',
    draft: 'warning',
    new: 'warning',
    reopened: 'warning',
    archived: 'default',
    retired: 'default',
    cancelled: 'danger',
    lost: 'danger',
    failed: 'danger',
  }
  return statusMap[status.toLowerCase()] || 'default'
}

export function getSeverityColor(
  severity: string
): 'success' | 'warning' | 'danger' | 'info' {
  const severityMap: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    low: 'info',
    medium: 'warning',
    high: 'danger',
    critical: 'danger',
  }
  return severityMap[severity.toLowerCase()] || 'info'
}
