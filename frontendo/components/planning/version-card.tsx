"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Download,
  MoreVertical,
  CheckCircle2,
  Trash2,
  Eye,
} from "lucide-react";
import { formatDate } from "@/lib/utils/formatting";

interface VersionCardProps {
  version: any;
  isCurrent: boolean;
  onView: (versionId: string) => void;
  onDownload: (versionId: string) => void;
  onSetCurrent: (versionId: string) => void;
  onDelete: (versionId: string) => void;
}

export function VersionCard({
  version,
  isCurrent,
  onView,
  onDownload,
  onSetCurrent,
  onDelete,
}: VersionCardProps) {
  return (
    <Card
      className={`p-4 hover:shadow-md transition-shadow ${isCurrent ? "border-primary" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium">Version {version.versionNumber}</h4>
              {isCurrent && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                  <CheckCircle2 className="h-3 w-3" />
                  Current
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{formatDate(version.createdAt, "MMM DD, YYYY")}</span>
              {version.file?.originalName && (
                <span className="truncate">{version.file.originalName}</span>
              )}
              {version.file?.bytes && (
                <span>{(version.file.bytes / 1024 / 1024).toFixed(2)} MB</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(version._id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload(version._id)}
          >
            <Download className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!isCurrent && (
                <>
                  <DropdownMenuItem onClick={() => onSetCurrent(version._id)}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Set as Current
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem
                onClick={() => onDelete(version._id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Version
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
