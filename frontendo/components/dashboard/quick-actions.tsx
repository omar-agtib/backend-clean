"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  FileText,
  AlertCircle,
  Package,
  Wrench,
  DollarSign,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      label: "New Project",
      icon: Plus,
      href: "/projects",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20",
    },
    {
      label: "Upload Plan",
      icon: FileText,
      href: "/planning",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/20",
    },
    {
      label: "Report Issue",
      icon: AlertCircle,
      href: "/quality",
      color: "bg-red-100 text-red-600 dark:bg-red-900/20",
    },
    {
      label: "Add Stock",
      icon: Package,
      href: "/stock",
      color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20",
    },
    {
      label: "Assign Tool",
      icon: Wrench,
      href: "/tools",
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900/20",
    },
    {
      label: "New Invoice",
      icon: DollarSign,
      href: "/billing",
      color: "bg-green-100 text-green-600 dark:bg-green-900/20",
    },
  ];

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-2"
            onClick={() => router.push(action.href)}
          >
            <div
              className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}
            >
              <action.icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">{action.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
}
