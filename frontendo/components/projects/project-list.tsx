import { Project } from "@/types";
import { ProjectCard } from "./project-card";
import { EmptyState } from "@/components/common/empty-state";
import { FolderOpen } from "lucide-react";

interface ProjectListProps {
  projects?: Project[]; // ✅ Optional
}

export function ProjectList({ projects }: ProjectListProps) {
  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        icon={FolderOpen}
        title="No projects yet"
        description="Create your first project to get started with project management"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}
