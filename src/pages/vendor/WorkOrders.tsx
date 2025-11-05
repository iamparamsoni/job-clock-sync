import { useState } from "react";
import { Search, Filter, Calendar, FileText, CheckCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkOrderStatus, WORK_ORDER_STATUS_LABELS, WORK_ORDER_STATUS_VARIANTS } from "@/types/workOrder";
import { useWorkOrders, useUpdateWorkOrderStatus } from "@/hooks/useWorkOrders";

const VENDOR_NAV_ITEMS = [
  { name: "Dashboard", path: "/vendor/dashboard" },
  { name: "Work Orders", path: "/vendor/work-orders" },
  { name: "Jobs", path: "/vendor/jobs" },
  { name: "Timesheets", path: "/vendor/timesheets" },
  { name: "Invoices", path: "/vendor/invoices" },
];

const VendorWorkOrders = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus | "ALL">("ALL");

  const { data: workOrders, isLoading, error, refetch } = useWorkOrders();
  const updateStatus = useUpdateWorkOrderStatus();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleUpdateStatus = (id: string, newStatus: WorkOrderStatus) => {
    updateStatus.mutate({ id, status: newStatus });
  };

  const filteredWorkOrders = (workOrders || []).filter((wo) => {
    const matchesSearch =
      wo.workOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || wo.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (date?: string) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />
      <Navigation items={VENDOR_NAV_ITEMS} />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Work Orders</h1>
          <p className="text-muted-foreground mt-2">View and manage assigned work orders</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by number, title, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as WorkOrderStatus | "ALL")}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    {Object.entries(WORK_ORDER_STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Orders List */}
        <div className="space-y-4">
          {error ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-destructive mb-4">{error.message}</p>
                <Button onClick={() => refetch()}>Retry</Button>
              </CardContent>
            </Card>
          ) : isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : filteredWorkOrders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No work orders found</p>
              </CardContent>
            </Card>
          ) : (
            filteredWorkOrders.map((workOrder) => (
              <Card key={workOrder.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{workOrder.title}</CardTitle>
                        <Badge variant={WORK_ORDER_STATUS_VARIANTS[workOrder.status]}>
                          {WORK_ORDER_STATUS_LABELS[workOrder.status]}
                        </Badge>
                      </div>
                      <CardDescription className="font-mono text-xs">
                        {workOrder.workOrderNumber}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{workOrder.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Due:</span>
                      <span>{formatDate(workOrder.dueDate)}</span>
                    </div>
                    {workOrder.assignedDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Assigned:</span>
                        <span>{formatDate(workOrder.assignedDate)}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {workOrder.vendorId === user?.id && workOrder.status !== "COMPLETED" && (
                    <div className="flex gap-2 mt-4">
                      {workOrder.status === "ASSIGNED" && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(workOrder.id, "IN_PROGRESS")}
                          disabled={updateStatus.isPending}
                        >
                          {updateStatus.isPending ? "Updating..." : "Start Work"}
                        </Button>
                      )}
                      {workOrder.status === "IN_PROGRESS" && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(workOrder.id, "COMPLETED")}
                          disabled={updateStatus.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {updateStatus.isPending ? "Updating..." : "Mark Complete"}
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default VendorWorkOrders;
