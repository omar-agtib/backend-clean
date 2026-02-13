'use client'

import { ProjectForm } from '@/components/projects/project-form'
import { useRouter } from 'next/navigation'

export default function NewProjectPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/projects')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
        <p className="text-muted-foreground mt-2">Add a new project to get started</p>
      </div>
      <ProjectForm onSuccess={handleSuccess} />
    </div>
  )
}
