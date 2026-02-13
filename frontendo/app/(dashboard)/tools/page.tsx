'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTools, useToolAssignments } from '@/hooks/useTools'
import { LoadingState } from '@/components/common/loading-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus, Search, Wrench } from 'lucide-react'

export default function ToolsPage() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')
  const [search, setSearch] = useState('')
  const { data: tools, isLoading: toolsLoading } = useTools(projectId || '', { search })
  const { data: assignments } = useToolAssignments(projectId || '')

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
          <h1 className="text-3xl font-bold tracking-tight">Tools</h1>
          <p className="text-muted-foreground mt-2">Manage tool inventory and assignments</p>
        </div>
        <Button size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Add Tool
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {toolsLoading ? (
        <LoadingState />
      ) : tools?.items && tools.items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.items.map((tool: any) => (
            <Card key={tool._id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <Wrench className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                  <div className="flex gap-2 mt-3">
                    <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      {tool.status}
                    </span>
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 px-2 py-1 rounded">
                      {assignments?.items?.filter((a: any) => a.tool === tool._id).length || 0} assigned
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No tools found. Add one to get started.</p>
        </Card>
      )}
    </div>
  )
}
