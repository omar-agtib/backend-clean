"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Calendar,
  MoreVertical,
  DollarSign,
  CheckCircle2,
  X,
} from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils/formatting";

interface InvoiceCardProps {
  invoice: any;
  onMarkPaid?: (invoiceId: string) => void;
  onCancel?: (invoiceId: string) => void;
}

export function InvoiceCard({
  invoice,
  onMarkPaid,
  onCancel,
}: InvoiceCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400";
      case "SENT":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "DRAFT":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
      case "CANCELLED":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
              invoice.status === "PAID"
                ? "bg-emerald-100 dark:bg-emerald-900/20"
                : "bg-blue-100 dark:bg-blue-900/20"
            }`}
          >
            <FileText
              className={`h-6 w-6 ${
                invoice.status === "PAID"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-blue-600 dark:text-blue-400"
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{invoice.number}</h3>
              <Badge className={getStatusColor(invoice.status)}>
                {invoice.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  Issued {formatDate(invoice.issuedAt, "MMM DD, YYYY")}
                </span>
              </div>
              {invoice.paidAt && (
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Paid {formatDate(invoice.paidAt, "MMM DD, YYYY")}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center gap-1 text-lg font-bold">
              <DollarSign className="h-4 w-4" />
              <span>{formatCurrency(invoice.amount)}</span>
            </div>
          </div>

          {(invoice.status === "SENT" || invoice.status === "DRAFT") && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {invoice.status === "SENT" && onMarkPaid && (
                  <DropdownMenuItem onClick={() => onMarkPaid(invoice._id)}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark as Paid
                  </DropdownMenuItem>
                )}
                {onCancel && (
                  <DropdownMenuItem
                    onClick={() => onCancel(invoice._id)}
                    className="text-destructive"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel Invoice
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </Card>
  );
}
