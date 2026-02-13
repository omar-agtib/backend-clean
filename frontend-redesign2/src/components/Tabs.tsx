import React from 'react';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'subtle';
}

export default function Tabs({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
}: TabsProps) {
  return (
    <div className="w-full">
      <div className="border-b border-border overflow-x-auto -mx-3 px-3 sm:-mx-4 sm:px-4 lg:-mx-6 lg:px-6">
        <div className="flex gap-1 sm:gap-2 min-w-min">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 border-b-2 ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-fg hover:text-foreground'
                }`}
              >
                {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="ml-1.5 rounded-full bg-error text-white text-xs px-1.5 py-0.5 font-semibold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
