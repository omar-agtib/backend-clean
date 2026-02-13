"use client";

import Link from "next/link";
import { Project } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/formatting";
import { Users, Calendar, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const memberCount = project.members?.length || 0;

  // ✅ Handle populated owner
  const ownerName =
    typeof project.owner === "string"
      ? "Unknown"
      : project.owner?.name || "Unknown";

  // ✅ Fix status badge colors to match backend statuses
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-50 text-emerald-700";
      case "COMPLETED":
        return "bg-blue-50 text-blue-700";
      case "PLANNING":
        return "bg-yellow-50 text-yellow-700";
      case "ARCHIVED":
        return "bg-gray-50 text-gray-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Link href={`/projects/${project._id}`} className="flex-1">
            <h3 className="text-lg font-semibold hover:text-primary transition-colors">
              {project.name}
            </h3>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/projects/${project._id}`}>View Details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/projects/${project._id}/settings`}>Settings</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {project.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {project.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{memberCount} members</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(project.createdAt, "MMM DD, YYYY")}</span>
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(project.status)}`}
          >
            {project.status}
          </span>
        </div>
      </div>
    </Card>
  );
}
