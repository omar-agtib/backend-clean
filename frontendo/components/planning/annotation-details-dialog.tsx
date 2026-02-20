"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Trash2,
  MessageSquare,
  User,
  Calendar,
  Edit,
  Save,
  X,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Annotation } from "@/types";
import {
  useUpdateAnnotation,
  useDeleteAnnotation,
  useAddComment,
  useDeleteComment,
} from "@/hooks/usePlanning";
import { DeleteAnnotationDialog } from "./delete-annotation-dialog";

interface AnnotationDetailsDialogProps {
  annotation: Annotation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
  onUpdated?: () => void;
}

const PRIORITY_COLORS = {
  LOW: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  MEDIUM:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
  HIGH: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
  CRITICAL: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
};

export function AnnotationDetailsDialog({
  annotation,
  open,
  onOpenChange,
  onDeleted,
  onUpdated,
}: AnnotationDetailsDialogProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [comment, setComment] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const updateAnnotation = useUpdateAnnotation();
  const deleteAnnotation = useDeleteAnnotation();
  const addComment = useAddComment();
  const deleteComment = useDeleteComment();

  // ✅ Reset editedName when annotation changes
  useEffect(() => {
    if (annotation) {
      setEditedName(annotation.content || "");
    }
  }, [annotation]);

  if (!annotation) return null;

  const handleEditName = () => {
    setEditedName(annotation.content || "");
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    try {
      await updateAnnotation.mutateAsync({
        annotationId: annotation._id,
        data: { content: editedName },
      });
      setIsEditingName(false);
      onUpdated?.(); // ✅ This will refetch
    } catch (error) {
      console.error("Failed to update annotation:", error);
    }
  };

  const handlePriorityChange = async (priority: string) => {
    try {
      await updateAnnotation.mutateAsync({
        annotationId: annotation._id,
        data: { priority },
      });
      onUpdated?.(); // ✅ This will refetch
    } catch (error) {
      console.error("Failed to update priority:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAnnotation.mutateAsync(annotation._id);
      setShowDeleteDialog(false);
      onOpenChange(false);
      onDeleted?.();
    } catch (error) {
      console.error("Failed to delete annotation:", error);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      await addComment.mutateAsync({
        annotationId: annotation._id,
        text: comment,
      });
      setComment("");
      onUpdated?.(); // ✅ This will refetch
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment.mutateAsync({
        annotationId: annotation._id,
        commentId,
      });
      onUpdated?.(); // ✅ This will refetch
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* ... keep all DialogHeader content same ... */}

          <Separator />

          <div className="space-y-4">
            {/* Priority Selector */}
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Priority
              </label>
              <Select
                value={annotation.priority || "MEDIUM"}
                onValueChange={handlePriorityChange}
                disabled={updateAnnotation.isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      Low Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="MEDIUM">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      Medium Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="HIGH">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      High Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="CRITICAL">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      Critical
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Name/Content Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Name</label>
                {!isEditingName && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEditName}
                    className="h-8"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
              {isEditingName ? (
                <div className="space-y-2">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Enter pin name..."
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveName}
                      disabled={updateAnnotation.isPending}
                    >
                      <Save className="h-3 w-3 mr-1" />
                      {updateAnnotation.isPending ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsEditingName(false);
                        setEditedName(annotation.content || "");
                      }}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-muted text-sm">
                  {annotation.content || (
                    <span className="text-muted-foreground italic">
                      No name
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* ... keep Position section same ... */}

            {/* Comments Section */}
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Comments ({annotation.comments?.length || 0})
              </label>

              {annotation.comments && annotation.comments.length > 0 && (
                <ScrollArea className="h-32 rounded-lg border p-3 mb-2">
                  <div className="space-y-3">
                    {annotation.comments.map((c) => (
                      <div key={c._id} className="text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-3 w-3" />
                            </div>
                            <span className="font-medium text-xs">
                              {typeof c.userId === "object"
                                ? c.userId.name
                                : "User"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(c.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDeleteComment(c._id)}
                            disabled={deleteComment.isPending}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="ml-8 text-muted-foreground">{c.text}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}

              <div className="flex gap-2">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="min-h-[60px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={handleAddComment}
                  disabled={!comment.trim() || addComment.isPending}
                  className="self-end"
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {addComment.isPending ? "Adding..." : "Add"}
                </Button>
              </div>
            </div>

            {/* ... keep Metadata section same ... */}
          </div>

          <Separator />

          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Annotation
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteAnnotationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        isDeleting={deleteAnnotation.isPending}
      />
    </>
  );
}
