'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useNonConformities, useQualitySummary } from '@/hooks/useQuality'
import { LoadingState } from '@/components/common/loading-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus, Search, AlertCircle } from 'lucide-react'

export default function QualityPage() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')
  const [search, setSearch] = useState('')
  const { data: nonConformities, isLoading } = useNonConformities(projectId || '', { search })
  const { data: summary } = useQualitySummary(projectId || '')

  if (!projectId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please select a project first</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quality Control</h1>
          <p className="text-muted-foreground mt-2">Track and manage non-conformities</p>
        </div>
        <Button size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Report Issue
        </Button>
      </div>

      {summary?.data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Issues</p>
            <p className="text-3xl font-bold mt-2">{summary.data.totalCount || 0}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Open Issues</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{summary.data.openCount || 0}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Resolved</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{summary.data.resolvedCount || 0}</p>
          </Card>
        </div>
      )}

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search issues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : nonConformities?.items && nonConformities.items.length > 0 ? (
        <div className="space-y-3">
          {nonConformities.items.map((nc: any) => (
            <Card key={nc._id} className="p-4 border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold">{nc.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{nc.description}</p>
                  <div className="flex gap-2 mt-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      nc.severity === 'critical' ? 'bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100' :
                      nc.severity === 'high' ? 'bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-100' :
                      'bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100'
                    }`}>
                      {nc.severity}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      nc.status === 'open' ? 'bg-red-100 dark:bg-red-900' :
                      nc.status === 'in-progress' ? 'bg-blue-100 dark:bg-blue-900' :
                      'bg-green-100 dark:bg-green-900'
                    }`}>
                      {nc.status}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No issues found. Great quality standards!</p>
        </Card>
      )}
    </div>
  )
}
