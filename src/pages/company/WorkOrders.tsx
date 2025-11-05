import { useState } from "react";
import { Search, Plus, Filter, Calendar, User, FileText, Edit, UserPlus } from "lucide-react";
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
import { WorkOrderStatus, WORK_ORDER_STATUS_LABELS, WORK_ORDER_STATUS_VARIANTS, WorkOrder } from "@/types/workOrder";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { WorkOrderFormDialog } from "@/components/workorders/WorkOrderFormDialog";
import { VendorAssignDialog } from "@/components/workorders/VendorAssignDialog";

const COMPANY_NAV_ITEMS = [
  { name: "Dashboard", path: "/company/dashboard" },
  { name: "Work Orders", path: "/company/work-orders" },
  { name: "Jobs", path: "/company/jobs" },
  { name: "Timesheets", path: "/company/timesheets" },
  { name: "Invoices", path: "/company/invoices" },
];

const CompanyWorkOrders = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus | "ALL">("ALL");
  const [workOrderFormOpen, setWorkOrderFormOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string | null>(null);
  const [selectedWorkOrderTitle, setSelectedWorkOrderTitle] = useState("");

  const { data: workOrders, isLoading, error } = useWorkOrders();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleAssignVendor = (workOrder: WorkOrder, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedWorkOrderId(workOrder.id);
    setSelectedWorkOrderTitle(workOrder.title);
    setAssignDialogOpen(true);
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
      <Navigation items={COMPANY_NAV_ITEMS} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Work Orders</h1>
            <p className="text-muted-foreground mt-2 text-base sm:text-lg">Manage and track all work orders seamlessly</p>
          </div>
          <Button onClick={() => setWorkOrderFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Work Order
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-md border-border/50">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by number, title, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 h-12 text-base"
                />
              </div>
              <div className="w-full lg:w-64">
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as WorkOrderStatus | "ALL")}>
                  <SelectTrigger className="h-12 text-base bg-background">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Filter by status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
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
        <div className="space-y-5">
          {error ? (
            <Card className="border-destructive/50">
              <CardContent className="py-16 text-center">
                <div className="max-w-md mx-auto">
                  <div className="mb-4 p-4 rounded-full bg-destructive/10 w-16 h-16 mx-auto flex items-center justify-center">
                    <FileText className="h-8 w-8 text-destructive" />
                  </div>
                  <p className="text-destructive mb-6 font-medium">{error.message}</p>
                </div>
              </CardContent>
            </Card>
          ) : isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <Card key={i} className="shadow-md">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-7 w-3/4" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : filteredWorkOrders.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="py-20 text-center">
                <div className="max-w-md mx-auto">
                  <div className="mb-6 p-6 rounded-full bg-muted w-24 h-24 mx-auto flex items-center justify-center">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No work orders found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery || statusFilter !== "ALL" 
                      ? "Try adjusting your search or filters" 
                      : "Create your first work order to get started"}
                  </p>
                  {!searchQuery && statusFilter === "ALL" && (
                    <Button onClick={() => setWorkOrderFormOpen(true)} size="lg">
                      <Plus className="h-5 w-5 mr-2" />
                      Create Work Order
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredWorkOrders.length}</span> work order{filteredWorkOrders.length !== 1 ? 's' : ''}
                </p>
              </div>
              {filteredWorkOrders.map((workOrder) => (
                <Card key={workOrder.id} className="hover:shadow-xl transition-all duration-200 border-border/50 hover:border-primary/30">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <CardTitle className="text-xl font-bold">{workOrder.title}</CardTitle>
                          <Badge variant={WORK_ORDER_STATUS_VARIANTS[workOrder.status]} className="text-xs px-3 py-1">
                            {WORK_ORDER_STATUS_LABELS[workOrder.status]}
                          </Badge>
                        </div>
                        <CardDescription className="font-mono text-xs flex items-center gap-2">
                          <FileText className="h-3 w-3" />
                          {workOrder.workOrderNumber}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-sm text-foreground/90 leading-relaxed">{workOrder.description}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-background border">
                        <div className="p-2 rounded-md bg-primary/10">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground font-medium">Due Date</p>
                          <p className="text-sm font-semibold truncate">{formatDate(workOrder.dueDate)}</p>
                        </div>
                      </div>
                      {workOrder.vendorId ? (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background border">
                          <div className="p-2 rounded-md bg-accent/10">
                            <User className="h-4 w-4 text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground font-medium">Status</p>
                            <p className="text-sm font-semibold truncate">Vendor Assigned</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-dashed">
                          <div className="p-2 rounded-md bg-muted">
                            <User className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground font-medium">Status</p>
                            <p className="text-sm font-semibold truncate">Unassigned</p>
                          </div>
                        </div>
                      )}
                      {workOrder.completedDate && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background border">
                          <div className="p-2 rounded-md bg-primary/10">
                            <Calendar className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground font-medium">Completed</p>
                            <p className="text-sm font-semibold truncate">{formatDate(workOrder.completedDate)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2">
                      {!workOrder.vendorId && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => handleAssignVendor(workOrder, e)}
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Assign Vendor
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      </main>

      <WorkOrderFormDialog
        open={workOrderFormOpen}
        onOpenChange={setWorkOrderFormOpen}
      />

      <VendorAssignDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        workOrderId={selectedWorkOrderId}
        workOrderTitle={selectedWorkOrderTitle}
      />
    </div>
  );
};

export default CompanyWorkOrders;
