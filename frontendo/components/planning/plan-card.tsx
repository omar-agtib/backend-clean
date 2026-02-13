"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, MoreVertical, Trash2, Edit } from "lucide-react";
import { formatDate } from "@/lib/utils/formatting";

interface PlanCardProps {
  plan: any;
  onDelete?: (planId: string) => void;
}

export function PlanCard({ plan, onDelete }: PlanCardProps) {
  const router = useRouter();

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all">
      <div
        className="p-6 cursor-pointer"
        onClick={() => router.push(`/planning/${plan._id}`)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{plan.name}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(plan.createdAt, "MMM DD, YYYY")}</span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/planning/${plan._id}`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              {onDelete && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(plan._id);
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <span className="text-xs text-muted-foreground">
            {plan.currentVersion ? "Has active version" : "No versions yet"}
          </span>
          <span
            className={`text-xs px-2 py-1 rounded ${
              plan.currentVersion
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                : "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
            }`}
          >
            {plan.currentVersion ? "Active" : "Draft"}
          </span>
        </div>
      </div>
    </Card>
  );
}
