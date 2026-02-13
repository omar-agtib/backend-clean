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
import { useAssignTool, useAvailableTools } from "@/hooks/useTools";
import { useProjects } from "@/hooks/useProjects";

interface AssignToolDialogProps {
  projectId: string;
  selectedToolId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignToolDialog({
  projectId,
  selectedToolId,
  open,
  onOpenChange,
}: AssignToolDialogProps) {
  const [toolId, setToolId] = useState(selectedToolId || "");
  const [assignedTo, setAssignedTo] = useState("");

  const { data: availableTools } = useAvailableTools();
  const { data: project } = useProjects(); // Get project members
  const assignTool = useAssignTool();

  const handleAssign = async () => {
    if (!toolId || !assignedTo) return;

    try {
      await assignTool.mutateAsync({ toolId, projectId, assignedTo });
      setToolId("");
      setAssignedTo("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to assign tool:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Tool</DialogTitle>
          <DialogDescription>
            Assign a tool from inventory to a team member
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Tool</Label>
            <Select value={toolId} onValueChange={setToolId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a tool..." />
              </SelectTrigger>
              <SelectContent>
                {availableTools?.map((tool: any) => (
                  <SelectItem key={tool._id} value={tool._id}>
                    {tool.name} {tool.serialNumber && `(${tool.serialNumber})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Assign To</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger>
                <SelectValue placeholder="Choose team member..." />
              </SelectTrigger>
              <SelectContent>
                {/* This would come from project members */}
                <SelectItem value="user1">John Doe</SelectItem>
                <SelectItem value="user2">Jane Smith</SelectItem>
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
            disabled={!toolId || !assignedTo || assignTool.isPending}
          >
            {assignTool.isPending ? "Assigning..." : "Assign Tool"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
