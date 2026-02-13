"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useNonConformities, useChangeNCStatus } from "@/hooks/useQuality";
import { LoadingState } from "@/components/common/loading-state";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  FolderOpen,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { NCCard } from "@/components/quality/nc-card";
import { CreateNCDialog } from "@/components/quality/create-nc-dialog";
import { AssignNCDialog } from "@/components/quality/assign-nc-dialog";

export default function QualityPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project");

  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [assignDialog, setAssignDialog] = useState<{
    open: boolean;
    ncId?: string;
    ncTitle?: string;
  }>({ open: false });

  const { data: ncs, isLoading } = useNonConformities(projectId || "");
  const changeStatus = useChangeNCStatus();

  const handleAssign = (ncId: string) => {
    const nc = ncs?.items?.find((n: any) => n._id === ncId);
    setAssignDialog({
      open: true,
      ncId,
      ncTitle: nc?.title,
    });
  };

  const handleChangeStatus = async (ncId: string, status: string) => {
    if (!projectId) return;
    await changeStatus.mutateAsync({ ncId, status, projectId });
  };

  const filteredNCs = ncs?.items?.filter((nc: any) =>
    nc.title.toLowerCase().includes(search.toLowerCase()),
  );

  const openNCs = ncs?.items?.filter((nc: any) => nc.status === "OPEN") || [];
  const inProgressNCs =
    ncs?.items?.filter((nc: any) => nc.status === "IN_PROGRESS") || [];
  const resolvedNCs =
    ncs?.items?.filter((nc: any) => nc.status === "RESOLVED") || [];
  const validatedNCs =
    ncs?.items?.filter((nc: any) => nc.status === "VALIDATED") || [];

  if (!projectId) {
    return (
      <EmptyState
        icon={FolderOpen}
        title="No Project Selected"
        description="Please select a project from the dropdown in the navbar"
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Quality Control
            </h1>
            <p className="text-muted-foreground mt-2">
              Track and manage non-conformities and quality issues
            </p>
          </div>
          <Button size="lg" onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Report Issue
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{ncs?.items?.length || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Open</p>
                <p className="text-2xl font-bold">{openNCs.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{inProgressNCs.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Validated</p>
                <p className="text-2xl font-bold">{validatedNCs.length}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search issues..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">
              All ({ncs?.items?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="open">Open ({openNCs.length})</TabsTrigger>
            <TabsTrigger value="in-progress">
              In Progress ({inProgressNCs.length})
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Resolved ({resolvedNCs.length})
            </TabsTrigger>
            <TabsTrigger value="validated">
              Validated ({validatedNCs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {isLoading ? (
              <LoadingState />
            ) : !filteredNCs || filteredNCs.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="No Quality Issues"
                description="Great! No non-conformities have been reported yet"
                action={
                  <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Report Issue
                  </Button>
                }
              />
            ) : (
              <div className="space-y-3">
                {filteredNCs.map((nc: any) => (
                  <NCCard
                    key={nc._id}
                    nc={nc}
                    onAssign={handleAssign}
                    onChangeStatus={handleChangeStatus}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="open" className="space-y-4 mt-6">
            {openNCs.length === 0 ? (
              <EmptyState
                icon={AlertCircle}
                title="No Open Issues"
                description="All issues have been assigned or resolved"
              />
            ) : (
              <div className="space-y-3">
                {openNCs.map((nc: any) => (
                  <NCCard
                    key={nc._id}
                    nc={nc}
                    onAssign={handleAssign}
                    onChangeStatus={handleChangeStatus}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-4 mt-6">
            {inProgressNCs.length === 0 ? (
              <EmptyState icon={Clock} title="No Issues In Progress" />
            ) : (
              <div className="space-y-3">
                {inProgressNCs.map((nc: any) => (
                  <NCCard
                    key={nc._id}
                    nc={nc}
                    onChangeStatus={handleChangeStatus}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4 mt-6">
            {resolvedNCs.length === 0 ? (
              <EmptyState icon={CheckCircle2} title="No Resolved Issues" />
            ) : (
              <div className="space-y-3">
                {resolvedNCs.map((nc: any) => (
                  <NCCard
                    key={nc._id}
                    nc={nc}
                    onChangeStatus={handleChangeStatus}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="validated" className="space-y-4 mt-6">
            {validatedNCs.length === 0 ? (
              <EmptyState icon={CheckCircle2} title="No Validated Issues" />
            ) : (
              <div className="space-y-3">
                {validatedNCs.map((nc: any) => (
                  <NCCard key={nc._id} nc={nc} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <CreateNCDialog
        projectId={projectId}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
      <AssignNCDialog
        projectId={projectId}
        ncId={assignDialog.ncId}
        ncTitle={assignDialog.ncTitle}
        open={assignDialog.open}
        onOpenChange={(open) => setAssignDialog({ ...assignDialog, open })}
      />
    </>
  );
}
