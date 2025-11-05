import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, DollarSign, FileText, Calendar, Send } from "lucide-react";
import { INVOICE_STATUS_LABELS, Invoice } from "@/types/invoice";
import { format } from "date-fns";
import { useInvoices, useSubmitInvoice } from "@/hooks/useInvoices";
import { InvoiceFormDialog } from "@/components/invoices/InvoiceFormDialog";
import { useWorkOrders } from "@/hooks/useWorkOrders";

const VENDOR_NAV_ITEMS = [
  { name: "Dashboard", path: "/vendor/dashboard" },
  { name: "Work Orders", path: "/vendor/work-orders" },
  { name: "Jobs", path: "/vendor/jobs" },
  { name: "Timesheets", path: "/vendor/timesheets" },
  { name: "Invoices", path: "/vendor/invoices" },
];

export default function VendorInvoices() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [invoiceFormOpen, setInvoiceFormOpen] = useState(false);

  const { data: invoices = [], isLoading } = useInvoices();
  const submitInvoice = useSubmitInvoice();
  const { data: workOrders = [] } = useWorkOrders();

  const handleLogout = () => {
    navigate("/");
  };

  const handleCreateInvoice = () => {
    setInvoiceFormOpen(true);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />
      <Navigation items={VENDOR_NAV_ITEMS} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Invoices</h1>
            <p className="text-muted-foreground">Create and manage your invoices</p>
          </div>
          <Button onClick={handleCreateInvoice}>
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          {["ALL", "DRAFT", "PENDING", "APPROVED", "PAID", "REJECTED"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              onClick={() => setStatusFilter(status)}
              size="sm"
            >
              {status === "ALL" ? "All" : INVOICE_STATUS_LABELS[status as keyof typeof INVOICE_STATUS_LABELS]}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : invoices.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No invoices yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first invoice to get paid for your work
              </p>
              <Button onClick={handleCreateInvoice}>
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {invoices
              .filter((invoice) =>
                statusFilter === "ALL" ? true : invoice.status === statusFilter
              )
              .map((invoice: Invoice) => (
              <Card key={invoice.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{invoice.invoiceNumber}</CardTitle>
                    <Badge>{INVOICE_STATUS_LABELS[invoice.status as keyof typeof INVOICE_STATUS_LABELS]}</Badge>
                  </div>
                  <CardDescription>
                    Created {formatDate(invoice.createdAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="text-sm font-medium">{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tax</span>
                    <span className="text-sm font-medium">{formatCurrency(invoice.taxAmount)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-lg font-bold">{formatCurrency(invoice.totalAmount)}</span>
                    </div>
                  </div>
                  {invoice.dueDate && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      Due: {formatDate(invoice.dueDate)}
                    </div>
                  )}
                  {invoice.paidDate && (
                    <div className="flex items-center text-sm text-green-600">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Paid: {formatDate(invoice.paidDate)}
                    </div>
                  )}
                  
                  {invoice.status === "DRAFT" && (
                    <Button 
                      className="w-full mt-2" 
                      size="sm"
                      onClick={() => submitInvoice.mutate(invoice.id)}
                      disabled={submitInvoice.isPending}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Submit Invoice
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <InvoiceFormDialog
        open={invoiceFormOpen}
        onOpenChange={setInvoiceFormOpen}
        workOrders={workOrders}
      />
    </div>
  );
}
