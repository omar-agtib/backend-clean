import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";

interface ProjectSidebarTab {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface ProjectSidebarProps {
  projectId: string;
  projectName?: string;
  tabs: ProjectSidebarTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  children?: React.ReactNode;
}

export default function ProjectSidebar({
  projectId,
  projectName,
  tabs,
  activeTab,
  onTabChange,
  isCollapsed = false,
  onCollapseChange,
  children,
}: ProjectSidebarProps) {
  const baseUrl = `/app/projects/${projectId}`;

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-card border-r border-border transition-all duration-300 overflow-y-auto",
          isCollapsed ? "w-0 md:w-16" : "w-full md:w-72"
        )}
      >
        <div className={cn("h-full flex flex-col", isCollapsed && "md:items-center md:justify-center")}>
          {!isCollapsed && (
            <>
              {/* Project Header */}
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold text-foreground truncate">
                  {projectName || "Project"}
                </h2>
                <p className="text-xs text-mutedForeground mt-1 truncate">
                  ID: {projectId}
                </p>
              </div>

              {/* Sidebar Content/Tabs */}
              <nav className="flex-1 p-4 space-y-2">
                {tabs.map((tab) => (
                  <NavLink
                    key={tab.id}
                    to={`${baseUrl}?tab=${tab.id}`}
                    onClick={() => onTabChange(tab.id)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition duration-200",
                        isActive
                          ? "bg-primary text-primaryForeground"
                          : "text-foreground hover:bg-muted"
                      )
                    }
                  >
                    {tab.icon && <tab.icon className="h-4 w-4 flex-shrink-0" />}
                    <span className="truncate">{tab.label}</span>
                  </NavLink>
                ))}
              </nav>

              {/* Custom Content */}
              {children && (
                <div className="px-4 py-4 border-t border-border">
                  {children}
                </div>
              )}
            </>
          )}

          {/* Collapse Button */}
          <div className="p-2 border-t border-border">
            <button
              onClick={() => onCollapseChange?.(!isCollapsed)}
              className={cn(
                "flex items-center justify-center h-10 w-full rounded-lg transition duration-200",
                "text-foreground hover:bg-muted",
                isCollapsed && "md:w-10"
              )}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
