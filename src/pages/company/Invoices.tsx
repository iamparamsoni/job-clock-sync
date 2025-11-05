import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, DollarSign, FileText, Calendar, CheckCircle, XCircle } from "lucide-react";
import { INVOICE_STATUS_LABELS, Invoice } from "@/types/invoice";
import { format } from "date-fns";
import { useInvoices, useApproveInvoice, useRejectInvoice, useMarkInvoiceAsPaid } from "@/hooks/useInvoices";

const COMPANY_NAV_ITEMS = [
  { name: "Dashboard", path: "/company/dashboard" },
  { name: "Work Orders", path: "/company/work-orders" },
  { name: "Jobs", path: "/company/jobs" },
  { name: "Timesheets", path: "/company/timesheets" },
  { name: "Invoices", path: "/company/invoices" },
];

export default function CompanyInvoices() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const { data: invoices = [], isLoading } = useInvoices();
  const approveInvoice = useApproveInvoice();
  const rejectInvoice = useRejectInvoice();
  const markAsPaid = useMarkInvoiceAsPaid();

  const handleLogout = () => {
    navigate("/");
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
      <Navigation items={COMPANY_NAV_ITEMS} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">Review and process vendor invoices</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by invoice number or vendor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {["ALL", "PENDING", "APPROVED", "PAID", "REJECTED"].map((status) => (
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
        </div>

        {isLoading ? (
          <div className="space-y-4">
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
              <h3 className="text-lg font-semibold mb-2">No invoices to review</h3>
              <p className="text-muted-foreground text-center">
                Vendor invoices will appear here for your review and approval
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {invoices
              .filter((invoice) =>
                statusFilter === "ALL" ? true : invoice.status === statusFilter
              )
              .filter((invoice) =>
                searchQuery
                  ? invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
                  : true
              )
              .map((invoice: Invoice) => (
              <Card key={invoice.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{invoice.invoiceNumber}</CardTitle>
                      <CardDescription>
                        Created {formatDate(invoice.createdAt)}
                      </CardDescription>
                    </div>
                    <Badge>{INVOICE_STATUS_LABELS[invoice.status as keyof typeof INVOICE_STATUS_LABELS]}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Subtotal</p>
                      <p className="font-medium">{formatCurrency(invoice.subtotal)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Tax</p>
                      <p className="font-medium">{formatCurrency(invoice.taxAmount)}</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold">Total Amount</span>
                      <span className="text-2xl font-bold">{formatCurrency(invoice.totalAmount)}</span>
                    </div>
                    
                    {invoice.dueDate && (
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Calendar className="mr-2 h-4 w-4" />
                        Due: {formatDate(invoice.dueDate)}
                      </div>
                    )}
                    
                    {invoice.paidDate && (
                      <div className="flex items-center text-sm text-green-600 mb-2">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Paid: {formatDate(invoice.paidDate)}
                      </div>
                    )}
                  </div>

                  {invoice.items && invoice.items.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Line Items</h4>
                      <div className="space-y-2">
                        {invoice.items.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {item.description} (×{item.quantity})
                            </span>
                            <span className="font-medium">{formatCurrency(item.total)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {invoice.status === "PENDING" && (
                    <div className="flex gap-2">
                      <Button 
                        variant="default" 
                        className="flex-1"
                        onClick={() => approveInvoice.mutate(invoice.id)}
                        disabled={approveInvoice.isPending}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="flex-1"
                        onClick={() => rejectInvoice.mutate(invoice.id)}
                        disabled={rejectInvoice.isPending}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}

                  {invoice.status === "APPROVED" && (
                    <Button 
                      variant="default" 
                      className="w-full"
                      onClick={() => markAsPaid.mutate(invoice.id)}
                      disabled={markAsPaid.isPending}
                    >
                      <DollarSign className="mr-2 h-4 w-4" />
                      Mark as Paid
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
