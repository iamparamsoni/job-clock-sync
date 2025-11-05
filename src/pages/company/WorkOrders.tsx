import { useState } from "react";
import { Search, Plus, Filter, Calendar, User, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { WorkOrderStatus, WORK_ORDER_STATUS_LABELS, WORK_ORDER_STATUS_VARIANTS } from "@/types/workOrder";
import { useWorkOrders, useCreateWorkOrder } from "@/hooks/useWorkOrders";
import { workOrderSchema, WorkOrderFormData } from "@/lib/validations";

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
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: workOrders, isLoading, error, refetch } = useWorkOrders();
  const createWorkOrder = useCreateWorkOrder();

  const form = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
    },
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const onSubmit = async (data: WorkOrderFormData) => {
    await createWorkOrder.mutateAsync({
      title: data.title,
      description: data.description,
      dueDate: data.dueDate || undefined,
    });
    form.reset();
    setIsCreateOpen(false);
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
      <Header userName={user?.name} onLogout={handleLogout} />
      <Navigation items={COMPANY_NAV_ITEMS} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Work Orders</h1>
          <p className="text-muted-foreground mt-2 text-base sm:text-lg">Manage and track all work orders seamlessly</p>
        </div>

        {/* Create Work Order Form */}
        <Collapsible open={isCreateOpen} onOpenChange={setIsCreateOpen} className="mb-8">
          <Card className="border-2 border-primary/10 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-accent/5">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-6 h-auto hover:bg-transparent">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Plus className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Create New Work Order</CardTitle>
                  </div>
                  <Badge variant="secondary" className="font-normal">
                    {isCreateOpen ? "Hide Form" : "Show Form"}
                  </Badge>
                </Button>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">Title *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Electrical Maintenance - Building A" 
                              {...field} 
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">Description *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Provide detailed description of the work order requirements..." 
                              rows={4} 
                              {...field}
                              className="resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">Due Date</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="pt-2">
                      <Button 
                        type="submit" 
                        className="w-full h-12 text-base font-semibold" 
                        disabled={createWorkOrder.isPending}
                      >
                        {createWorkOrder.isPending ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                            Creating...
                          </div>
                        ) : (
                          <>
                            <Plus className="h-5 w-5 mr-2" />
                            Create Work Order
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

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
                  <SelectTrigger className="h-12 text-base">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Filter by status" />
                    </div>
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
        <div className="space-y-5">
          {error ? (
            <Card className="border-destructive/50">
              <CardContent className="py-16 text-center">
                <div className="max-w-md mx-auto">
                  <div className="mb-4 p-4 rounded-full bg-destructive/10 w-16 h-16 mx-auto flex items-center justify-center">
                    <FileText className="h-8 w-8 text-destructive" />
                  </div>
                  <p className="text-destructive mb-6 font-medium">{error.message}</p>
                  <Button onClick={() => refetch()} variant="outline">
                    Retry Loading
                  </Button>
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
                    <Button onClick={() => setIsCreateOpen(true)} size="lg">
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
                      {workOrder.vendorId && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background border">
                          <div className="p-2 rounded-md bg-accent/10">
                            <User className="h-4 w-4 text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground font-medium">Assignment</p>
                            <p className="text-sm font-semibold truncate">Vendor Assigned</p>
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
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CompanyWorkOrders;
