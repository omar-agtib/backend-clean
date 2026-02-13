"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateMilestone } from "@/hooks/useProgress";

interface CreateMilestoneDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMilestoneDialog({
  projectId,
  open,
  onOpenChange,
}: CreateMilestoneDialogProps) {
  const [name, setName] = useState("");
  const createMilestone = useCreateMilestone();

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      await createMilestone.mutateAsync({ projectId, name: name.trim() });
      setName("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create milestone:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Milestone</DialogTitle>
          <DialogDescription>
            Add a new milestone to track project progress
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Milestone Name</Label>
            <Input
              id="name"
              placeholder="e.g., Foundation Complete, Walls Erected..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && name.trim()) {
                  handleCreate();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || createMilestone.isPending}
          >
            {createMilestone.isPending ? "Creating..." : "Create Milestone"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
