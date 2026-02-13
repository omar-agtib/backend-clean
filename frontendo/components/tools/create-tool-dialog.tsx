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
import { useCreateTool } from "@/hooks/useTools";

interface CreateToolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateToolDialog({
  open,
  onOpenChange,
}: CreateToolDialogProps) {
  const [name, setName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const createTool = useCreateTool();

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      await createTool.mutateAsync({
        name: name.trim(),
        serialNumber: serialNumber.trim() || undefined,
      });
      setName("");
      setSerialNumber("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create tool:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Tool to Inventory</DialogTitle>
          <DialogDescription>
            Add a new tool to the inventory system
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tool Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Hammer, Drill, Saw..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="serialNumber">Serial Number (Optional)</Label>
            <Input
              id="serialNumber"
              placeholder="e.g., SN-12345"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || createTool.isPending}
          >
            {createTool.isPending ? "Adding..." : "Add Tool"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
