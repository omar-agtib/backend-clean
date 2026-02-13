import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  href?: string
}

export function StatCard({ title, value, subtitle, icon: Icon, href }: StatCardProps) {
  const content = (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>}
      </div>
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href}>
        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
          {content}
        </Card>
      </Link>
    )
  }

  return <Card className="p-6">{content}</Card>
}
