'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useMilestones, useProgress } from '@/hooks/useProgress'
import { LoadingState } from '@/components/common/loading-state'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, CheckCircle2, Circle } from 'lucide-react'

export default function ProgressPage() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')
  const { data: progress, isLoading: progressLoading } = useProgress(projectId || '')
  const { data: milestones, isLoading: milestonesLoading } = useMilestones(projectId || '')

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
          <h1 className="text-3xl font-bold tracking-tight">Progress</h1>
          <p className="text-muted-foreground mt-2">Track and manage project milestones</p>
        </div>
        <Button size="lg">
          <Plus className="mr-2 h-4 w-4" />
          New Milestone
        </Button>
      </div>

      {progressLoading ? (
        <LoadingState />
      ) : progress?.data ? (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <p className="text-4xl font-bold mt-2">{progress.data.percentage || 0}%</p>
            </div>
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{progress.data.percentage || 0}%</span>
            </div>
          </div>
        </Card>
      ) : null}

      <div>
        <h2 className="text-xl font-semibold mb-4">Milestones</h2>
        {milestonesLoading ? (
          <LoadingState />
        ) : milestones?.items && milestones.items.length > 0 ? (
          <div className="space-y-3">
            {milestones.items.map((milestone: any) => (
              <Card key={milestone._id} className="p-4 flex items-center gap-4">
                {milestone.completed ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                ) : (
                  <Circle className="h-6 w-6 text-slate-400 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{milestone.name}</h3>
                  <p className="text-sm text-muted-foreground">{milestone.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{new Date(milestone.dueDate).toLocaleDateString()}</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No milestones yet. Create one to track progress.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
