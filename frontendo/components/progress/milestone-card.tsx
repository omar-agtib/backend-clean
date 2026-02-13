"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle2, Circle, MoreVertical, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils/formatting";

interface MilestoneCardProps {
  milestone: any;
  onUpdateProgress: (milestoneId: string, progress: number) => void;
  onDelete: (milestoneId: string) => void;
}

export function MilestoneCard({
  milestone,
  onUpdateProgress,
  onDelete,
}: MilestoneCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localProgress, setLocalProgress] = useState(milestone.progress);

  const handleSave = () => {
    onUpdateProgress(milestone._id, localProgress);
    setIsEditing(false);
  };

  const handleComplete = () => {
    onUpdateProgress(milestone._id, 100);
  };

  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          {milestone.completed ? (
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          ) : (
            <Circle className="h-6 w-6 text-gray-300" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{milestone.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Created {formatDate(milestone.createdAt, "MMM DD, YYYY")}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!milestone.completed && (
                  <DropdownMenuItem onClick={handleComplete}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark Complete
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => onDelete(milestone._id)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Slider
                  value={[localProgress]}
                  onValueChange={([value]) => setLocalProgress(value)}
                  max={100}
                  step={5}
                  className="flex-1"
                />
                <span className="text-sm font-medium min-w-[40px]">
                  {localProgress}%
                </span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setLocalProgress(milestone.progress);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="space-y-2 cursor-pointer"
              onClick={() => !milestone.completed && setIsEditing(true)}
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{milestone.progress}%</span>
              </div>
              <Progress value={milestone.progress} className="h-2" />
              {!milestone.completed && (
                <p className="text-xs text-muted-foreground">
                  Click to update progress
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
