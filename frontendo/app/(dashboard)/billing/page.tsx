"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  useInvoices,
  useBillingSummary,
  useMarkPaid,
  useCancelInvoice,
} from "@/hooks/useBilling";
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
  FileText,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { InvoiceCard } from "@/components/billing/invoice-card";
import { CreateInvoiceDialog } from "@/components/billing/create-invoice-dialog";
import { formatCurrency } from "@/lib/utils/formatting";

export default function BillingPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project");

  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: invoices, isLoading } = useInvoices(projectId || "");
  const { data: summary } = useBillingSummary(projectId || "");
  const markPaid = useMarkPaid();
  const cancelInvoice = useCancelInvoice();

  const handleMarkPaid = async (invoiceId: string) => {
    if (!projectId || !confirm("Mark this invoice as paid?")) return;
    await markPaid.mutateAsync({ invoiceId, projectId });
  };

  const handleCancel = async (invoiceId: string) => {
    if (!projectId || !confirm("Cancel this invoice?")) return;
    await cancelInvoice.mutateAsync({ invoiceId, projectId });
  };

  const filteredInvoices = invoices?.items?.filter((inv: any) =>
    inv.number.toLowerCase().includes(search.toLowerCase()),
  );

  const draftInvoices =
    invoices?.items?.filter((inv: any) => inv.status === "DRAFT") || [];
  const sentInvoices =
    invoices?.items?.filter((inv: any) => inv.status === "SENT") || [];
  const paidInvoices =
    invoices?.items?.filter((inv: any) => inv.status === "PAID") || [];
  const cancelledInvoices =
    invoices?.items?.filter((inv: any) => inv.status === "CANCELLED") || [];

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
            <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
            <p className="text-muted-foreground mt-2">
              Manage invoices and track payments
            </p>
          </div>
          <Button size="lg" onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Invoices
                  </p>
                  <p className="text-2xl font-bold">
                    {summary.totals?.count || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(summary.totals?.totalAmount || 0)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paid</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(summary.byStatus?.PAID?.totalAmount || 0)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Outstanding</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(summary.byStatus?.SENT?.totalAmount || 0)}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">
              All ({invoices?.items?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="draft">
              Draft ({draftInvoices.length})
            </TabsTrigger>
            <TabsTrigger value="sent">Sent ({sentInvoices.length})</TabsTrigger>
            <TabsTrigger value="paid">Paid ({paidInvoices.length})</TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledInvoices.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {isLoading ? (
              <LoadingState />
            ) : !filteredInvoices || filteredInvoices.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No Invoices Yet"
                description="Create your first invoice to start tracking payments"
                action={
                  <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Invoice
                  </Button>
                }
              />
            ) : (
              <div className="space-y-3">
                {filteredInvoices.map((invoice: any) => (
                  <InvoiceCard
                    key={invoice._id}
                    invoice={invoice}
                    onMarkPaid={handleMarkPaid}
                    onCancel={handleCancel}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="draft" className="space-y-4 mt-6">
            {draftInvoices.length === 0 ? (
              <EmptyState icon={FileText} title="No Draft Invoices" />
            ) : (
              <div className="space-y-3">
                {draftInvoices.map((invoice: any) => (
                  <InvoiceCard
                    key={invoice._id}
                    invoice={invoice}
                    onCancel={handleCancel}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sent" className="space-y-4 mt-6">
            {sentInvoices.length === 0 ? (
              <EmptyState icon={FileText} title="No Sent Invoices" />
            ) : (
              <div className="space-y-3">
                {sentInvoices.map((invoice: any) => (
                  <InvoiceCard
                    key={invoice._id}
                    invoice={invoice}
                    onMarkPaid={handleMarkPaid}
                    onCancel={handleCancel}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="paid" className="space-y-4 mt-6">
            {paidInvoices.length === 0 ? (
              <EmptyState icon={DollarSign} title="No Paid Invoices" />
            ) : (
              <div className="space-y-3">
                {paidInvoices.map((invoice: any) => (
                  <InvoiceCard key={invoice._id} invoice={invoice} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4 mt-6">
            {cancelledInvoices.length === 0 ? (
              <EmptyState icon={AlertCircle} title="No Cancelled Invoices" />
            ) : (
              <div className="space-y-3">
                {cancelledInvoices.map((invoice: any) => (
                  <InvoiceCard key={invoice._id} invoice={invoice} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <CreateInvoiceDialog
        projectId={projectId}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </>
  );
}
