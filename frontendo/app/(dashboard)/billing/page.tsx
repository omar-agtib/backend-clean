'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useInvoices, useBillingSummary } from '@/hooks/useBilling'
import { LoadingState } from '@/components/common/loading-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus, Search, FileText, Download } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/formatting'

export default function BillingPage() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')
  const [search, setSearch] = useState('')
  const { data: invoices, isLoading } = useInvoices(projectId || '', { search })
  const { data: summary } = useBillingSummary(projectId || '')

  if (!projectId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please select a project first</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
          <p className="text-muted-foreground mt-2">Manage invoices and payments</p>
        </div>
        <Button size="lg">
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </div>

      {summary?.data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-3xl font-bold mt-2">{formatCurrency(summary.data.totalRevenue || 0)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Paid Invoices</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{summary.data.paidCount || 0}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Outstanding</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{formatCurrency(summary.data.outstanding || 0)}</p>
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

      {isLoading ? (
        <LoadingState />
      ) : invoices?.items && invoices.items.length > 0 ? (
        <div className="space-y-3">
          {invoices.items.map((invoice: any) => (
            <Card key={invoice._id} className="p-4 flex items-center justify-between hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <FileText className="h-5 w-5 text-slate-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">{invoice.invoiceNumber}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(invoice.amount)}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    invoice.status === 'paid' 
                      ? 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100'
                      : 'bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-100'
                  }`}>
                    {invoice.status}
                  </span>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No invoices found. Create one to get started.</p>
        </Card>
      )}
    </div>
  )
}
