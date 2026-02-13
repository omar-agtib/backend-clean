"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  usePlan,
  usePlanVersions,
  useUploadPlanVersion,
  useDeletePlanVersion,
  useDeletePlan,
} from "@/hooks/usePlanning";
import { LoadingState } from "@/components/common/loading-state";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Upload,
  FileText,
  Trash2,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils/formatting";
import { VersionCard } from "@/components/planning/version-card";
import { planningApi } from "@/lib/api/planning";

export default function PlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.planId as string;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { data: plan, isLoading: planLoading } = usePlan(planId);
  const { data: versions, isLoading: versionsLoading } =
    usePlanVersions(planId);
  const uploadVersion = useUploadPlanVersion();
  const deleteVersion = useDeletePlanVersion();
  const deletePlan = useDeletePlan();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await uploadVersion.mutateAsync({ planId, file });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Failed to upload version:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (versionId: string) => {
    try {
      const { url } = await planningApi.getVersionSignedUrl(versionId);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Failed to download version:", error);
    }
  };

  const handleViewVersion = (versionId: string) => {
    router.push(`/planning/${planId}/viewer?version=${versionId}`);
  };

  const handleSetCurrent = async (versionId: string) => {
    try {
      await planningApi.setCurrentVersion(versionId);
      window.location.reload();
    } catch (error) {
      console.error("Failed to set current version:", error);
    }
  };

  const handleDeleteVersion = async (versionId: string) => {
    if (confirm("Are you sure you want to delete this version?")) {
      await deleteVersion.mutateAsync(versionId);
    }
  };

  const handleDeletePlan = async () => {
    try {
      await deletePlan.mutateAsync(planId);
      router.push("/planning");
    } catch (error) {
      console.error("Failed to delete plan:", error);
    }
  };

  if (planLoading || versionsLoading) {
    return <LoadingState />;
  }

  if (!plan) {
    return (
      <EmptyState
        icon={FileText}
        title="Plan Not Found"
        description="This plan doesn't exist or has been deleted"
        action={
          <Button onClick={() => router.push("/planning")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Plans
          </Button>
        }
      />
    );
  }

  const currentVersionId =
    typeof plan.currentVersion === "string"
      ? plan.currentVersion
      : plan.currentVersion?._id;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/planning")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{plan.name}</h1>
              <p className="text-muted-foreground mt-1">
                Created {formatDate(plan.createdAt, "MMM DD, YYYY")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload Version"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Plan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {!versions || versions.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No Versions Yet"
            description="Upload your first version to get started. Supported formats: PDF, DWG, DXF, PNG, JPG"
            action={
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Version
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Versions ({versions.length})
              </h2>
              {currentVersionId && (
                <Button
                  onClick={() => handleViewVersion(currentVersionId)}
                  variant="outline"
                >
                  View Current Version
                </Button>
              )}
            </div>
            <div className="space-y-3">
              {versions.map((version: any) => (
                <VersionCard
                  key={version._id}
                  version={version}
                  isCurrent={currentVersionId === version._id}
                  onView={handleViewVersion}
                  onDownload={handleDownload}
                  onSetCurrent={handleSetCurrent}
                  onDelete={handleDeleteVersion}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{plan.name}"? This action cannot
              be undone. All versions and annotations will be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeletePlan}
              disabled={deletePlan.isPending}
            >
              {deletePlan.isPending ? "Deleting..." : "Delete Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
