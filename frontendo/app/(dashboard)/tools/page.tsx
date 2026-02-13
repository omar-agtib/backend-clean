"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  useAllTools,
  useActiveAssignments,
  useReturnTool,
  useMaintenance,
} from "@/hooks/useTools";
import { LoadingState } from "@/components/common/loading-state";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, FolderOpen, Wrench, Package } from "lucide-react";
import { ToolCard } from "@/components/tools/tool-card";
import { AssignmentCard } from "@/components/tools/assignment-card";
import { CreateToolDialog } from "@/components/tools/create-tool-dialog";
import { AssignToolDialog } from "@/components/tools/assign-tool-dialog";

export default function ToolsPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project");

  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedToolId, setSelectedToolId] = useState<string>();

  const { data: tools, isLoading: toolsLoading } = useAllTools();
  const { data: assignments, isLoading: assignmentsLoading } =
    useActiveAssignments(projectId || "");
  const { data: maintenance } = useMaintenance(projectId || "");
  const returnTool = useReturnTool();

  const handleAssign = (toolId: string) => {
    setSelectedToolId(toolId);
    setIsAssignOpen(true);
  };

  const handleReturn = async (toolId: string) => {
    if (confirm("Return this tool?")) {
      await returnTool.mutateAsync({ toolId });
    }
  };

  const filteredTools = tools?.items?.filter((tool: any) =>
    tool.name.toLowerCase().includes(search.toLowerCase()),
  );

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
            <h1 className="text-3xl font-bold tracking-tight">Tools</h1>
            <p className="text-muted-foreground mt-2">
              Manage tool inventory, assignments, and maintenance
            </p>
          </div>
          <Button size="lg" onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Tool
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setIsAssignOpen(true)}>
            <Package className="mr-2 h-4 w-4" />
            Assign Tool
          </Button>
        </div>

        <Tabs defaultValue="inventory" className="w-full">
          <TabsList>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4 mt-6">
            {toolsLoading ? (
              <LoadingState />
            ) : !filteredTools || filteredTools.length === 0 ? (
              <EmptyState
                icon={Wrench}
                title="No Tools in Inventory"
                description="Add tools to start tracking your equipment"
                action={
                  <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Tool
                  </Button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTools.map((tool: any) => (
                  <ToolCard
                    key={tool._id}
                    tool={tool}
                    onAssign={handleAssign}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4 mt-6">
            {assignmentsLoading ? (
              <LoadingState />
            ) : !assignments || assignments.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No Active Assignments"
                description="No tools are currently assigned to team members"
              />
            ) : (
              <div className="space-y-3">
                {assignments.map((assignment: any) => (
                  <AssignmentCard
                    key={assignment._id}
                    assignment={assignment}
                    onReturn={handleReturn}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4 mt-6">
            <EmptyState
              icon={Wrench}
              title="Maintenance Records"
              description="Maintenance tracking coming soon"
            />
          </TabsContent>
        </Tabs>
      </div>

      <CreateToolDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <AssignToolDialog
        projectId={projectId}
        selectedToolId={selectedToolId}
        open={isAssignOpen}
        onOpenChange={setIsAssignOpen}
      />
    </>
  );
}
