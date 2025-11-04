import { useState } from "react";
import { Search, Plus, Filter, Calendar, User, FileText } from "lucide-react";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_WORK_ORDERS } from "@/data/mockWorkOrders";
import { WorkOrder, WorkOrderStatus, WORK_ORDER_STATUS_LABELS, WORK_ORDER_STATUS_VARIANTS } from "@/types/workOrder";
import { toast } from "sonner";

const COMPANY_NAV_ITEMS = [
  { label: "Dashboard", path: "/company/dashboard" },
  { label: "Post Jobs", path: "/company/post-jobs" },
  { label: "Work Orders", path: "/company/work-orders" },
  { label: "Invoices", path: "/company/invoices" },
  { label: "Admin", path: "/company/admin" },
];

const CompanyWorkOrders = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(MOCK_WORK_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus | "ALL">("ALL");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const [newWorkOrder, setNewWorkOrder] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleCreateWorkOrder = () => {
    if (!newWorkOrder.title || !newWorkOrder.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const workOrder: WorkOrder = {
      id: String(workOrders.length + 1),
      workOrderNumber: `WO-2024-${160 + workOrders.length}`,
      title: newWorkOrder.title,
      description: newWorkOrder.description,
      companyId: user?.id || "2",
      status: "DRAFT",
      dueDate: newWorkOrder.dueDate || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setWorkOrders([workOrder, ...workOrders]);
    setNewWorkOrder({ title: "", description: "", dueDate: "" });
    setIsCreateOpen(false);
    toast.success("Work order created successfully");
  };

  const filteredWorkOrders = workOrders.filter((wo) => {
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
      <Header userName={user?.name} onLogout={handleLogout} />
      <Navigation items={COMPANY_NAV_ITEMS} />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Work Orders</h1>
          <p className="text-muted-foreground mt-2">Manage and track all work orders</p>
        </div>

        {/* Create Work Order Form */}
        <Collapsible open={isCreateOpen} onOpenChange={setIsCreateOpen} className="mb-6">
          <Card>
            <CardHeader>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-6 h-auto">
                  <div className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    <CardTitle>Create New Work Order</CardTitle>
                  </div>
                  <span className="text-muted-foreground">{isCreateOpen ? "Hide" : "Show"}</span>
                </Button>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter work order title"
                    value={newWorkOrder.title}
                    onChange={(e) => setNewWorkOrder({ ...newWorkOrder, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter detailed description"
                    value={newWorkOrder.description}
                    onChange={(e) => setNewWorkOrder({ ...newWorkOrder, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    value={newWorkOrder.dueDate}
                    onChange={(e) => setNewWorkOrder({ ...newWorkOrder, dueDate: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreateWorkOrder} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Work Order
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

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
          {filteredWorkOrders.length === 0 ? (
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Due:</span>
                      <span>{formatDate(workOrder.dueDate)}</span>
                    </div>
                    {workOrder.vendorId && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Assigned to vendor</span>
                      </div>
                    )}
                    {workOrder.completedDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Completed:</span>
                        <span>{formatDate(workOrder.completedDate)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default CompanyWorkOrders;
