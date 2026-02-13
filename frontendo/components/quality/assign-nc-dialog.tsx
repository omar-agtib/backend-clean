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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssignNC } from "@/hooks/useQuality";

interface AssignNCDialogProps {
  projectId: string;
  ncId?: string;
  ncTitle?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignNCDialog({
  projectId,
  ncId,
  ncTitle,
  open,
  onOpenChange,
}: AssignNCDialogProps) {
  const [assignedTo, setAssignedTo] = useState("");
  const assignNC = useAssignNC();

  const handleAssign = async () => {
    if (!ncId || !assignedTo) return;

    try {
      await assignNC.mutateAsync({ ncId, assignedTo, projectId });
      setAssignedTo("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to assign NC:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Non-Conformity</DialogTitle>
          <DialogDescription>
            {ncTitle && `Assign "${ncTitle}" to a team member`}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Assign To</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger>
                <SelectValue placeholder="Choose team member..." />
              </SelectTrigger>
              <SelectContent>
                {/* This would come from project members */}
                <SelectItem value="user1">
                  John Doe (Quality Inspector)
                </SelectItem>
                <SelectItem value="user2">Jane Smith (Site Manager)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!assignedTo || assignNC.isPending}
          >
            {assignNC.isPending ? "Assigning..." : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
