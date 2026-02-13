import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/cn';

interface SidebarTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface WorkspaceSidebarProps {
  projectName?: string;
  projectId?: string;
  tabs: SidebarTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function WorkspaceSidebar({
  projectName,
  projectId,
  tabs,
  activeTab,
  onTabChange,
  isCollapsed = false,
  onCollapsedChange,
  isOpen = true,
  onClose,
}: WorkspaceSidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 bottom-0 z-40 md:static md:top-auto md:z-auto',
          'bg-card border-r border-border',
          'transition-all duration-300 ease-out',
          'flex flex-col',
          // Mobile: slides in from left
          isOpen ? 'w-64 md:w-auto' : '-left-64 md:left-0',
          // Desktop: collapses to icon-only
          isCollapsed ? 'md:w-20' : 'md:w-64'
        )}
      >
        {/* Header */}
        <div className="h-16 border-b border-border px-4 flex items-center justify-between flex-shrink-0">
          {!isCollapsed && (
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-foreground truncate">
                {projectName || 'Workspace'}
              </h3>
              {projectId && (
                <p className="text-xs text-muted-fg truncate">
                  {projectId.slice(0, 8)}...
                </p>
              )}
            </div>
          )}

          {/* Close button (mobile) and Collapse button (desktop) */}
          <button
            onClick={() => {
              if (onClose) {
                onClose();
              } else if (onCollapsedChange) {
                onCollapsedChange(!isCollapsed);
              }
            }}
            className="h-9 w-9 rounded-md hover:bg-muted flex items-center justify-center transition-colors duration-200 flex-shrink-0"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {onClose ? (
              <ChevronLeft className="h-5 w-5" />
            ) : isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                if (onClose) onClose(); // Close mobile sidebar on selection
              }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-200',
                activeTab === tab.id
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-fg hover:text-foreground hover:bg-muted',
                isCollapsed && 'justify-center'
              )}
              title={isCollapsed ? tab.label : undefined}
            >
              <span className="flex-shrink-0">{tab.icon}</span>
              {!isCollapsed && <span className="truncate">{tab.label}</span>}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
