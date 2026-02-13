'use client'

import { useRouter } from 'next/navigation'
import { useProjects } from '@/hooks/useProjects'
import { ProjectList } from '@/components/projects/project-list'
import { LoadingState } from '@/components/common/loading-state'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function ProjectsPage() {
  const router = useRouter()
  const { data, isLoading, error } = useProjects()

  const handleNewProject = () => {
    router.push('/projects/new')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-2">Manage and organize your projects</p>
        </div>
        <Button onClick={handleNewProject} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : error || !data ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load projects</p>
        </div>
      ) : (
        <ProjectList projects={data.items} />
      )}
    </div>
  )
}
