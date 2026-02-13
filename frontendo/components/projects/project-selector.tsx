"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useProjects } from "@/hooks/useProjects";
import { Check, ChevronsUpDown, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function ProjectSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  // Get selected project from URL or localStorage
  const urlProjectId = searchParams.get("project");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    urlProjectId ||
      (typeof window !== "undefined"
        ? localStorage.getItem("selectedProjectId")
        : null),
  );

  const { data, isLoading } = useProjects(1, 100); // Get all projects

  const projects = data?.items || [];
  const selectedProject = projects.find((p) => p._id === selectedProjectId);

  // Update URL when project changes
  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setOpen(false);

    // Save to localStorage
    localStorage.setItem("selectedProjectId", projectId);

    // Update URL with project query param
    const params = new URLSearchParams(searchParams.toString());
    params.set("project", projectId);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Clear selection
  const handleClearSelection = () => {
    setSelectedProjectId(null);
    setOpen(false);
    localStorage.removeItem("selectedProjectId");

    // Remove project param from URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete("project");
    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.push(newUrl);
  };

  // Sync URL param on mount
  useEffect(() => {
    if (selectedProjectId && !urlProjectId) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("project", selectedProjectId);
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [selectedProjectId, urlProjectId, pathname, searchParams, router]);

  if (isLoading) {
    return <div className="w-[280px] h-10 bg-muted animate-pulse rounded-md" />;
  }

  if (projects.length === 0) {
    return (
      <Button variant="outline" className="w-[280px] justify-start" asChild>
        <a href="/projects">
          <FolderOpen className="mr-2 h-4 w-4" />
          <span>Create your first project</span>
        </a>
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[280px] justify-between"
        >
          {selectedProject ? (
            <span className="flex items-center gap-2 truncate">
              <FolderOpen className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{selectedProject.name}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">Select project...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <Command>
          <CommandInput placeholder="Search projects..." />
          <CommandEmpty>No project found.</CommandEmpty>
          <CommandList>
            <CommandGroup className="max-h-[300px] overflow-auto">
              {projects.map((project) => (
                <CommandItem
                  key={project._id}
                  value={project.name}
                  onSelect={() => handleSelectProject(project._id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedProjectId === project._id
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{project.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {project.status} • {project.members?.length || 0} members
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {selectedProjectId && (
            <>
              <div className="border-t" />
              <div className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-muted-foreground"
                  onClick={handleClearSelection}
                >
                  Clear selection
                </Button>
              </div>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
