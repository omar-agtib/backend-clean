"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { FolderOpen } from "lucide-react";
import Link from "next/link";

interface RecentProjectsProps {
  projects: Array<{
    _id: string;
    name: string;
    status: string;
    updatedAt: string;
  }>;
}

const statusColors: Record<string, string> = {
  PLANNING: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  ACTIVE:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  COMPLETED:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
  ARCHIVED: "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400",
};

export function RecentProjects({ projects }: RecentProjectsProps) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Recent Projects</h3>
      <div className="space-y-3">
        {projects.slice(0, 5).map((project) => (
          <Link
            key={project._id}
            href={`/projects/${project._id}`}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FolderOpen className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{project.name}</p>
              <p className="text-xs text-muted-foreground">
                Updated{" "}
                {formatDistanceToNow(new Date(project.updatedAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <Badge
              className={statusColors[project.status] || statusColors.PLANNING}
            >
              {project.status}
            </Badge>
          </Link>
        ))}
      </div>
    </Card>
  );
}
