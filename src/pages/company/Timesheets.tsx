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
import { Search, Clock, Calendar, FileText, CheckCircle, XCircle, Plus } from "lucide-react";
import { TIMESHEET_STATUS_LABELS, Timesheet } from "@/types/timesheet";
import { format } from "date-fns";
import { useTimesheets, useApproveTimesheet, useRejectTimesheet } from "@/hooks/useTimesheets";
import { TimesheetFormDialog } from "@/components/timesheets/TimesheetFormDialog";
import { useWorkOrders } from "@/hooks/useWorkOrders";

const COMPANY_NAV_ITEMS = [
  { name: "Dashboard", path: "/company/dashboard" },
  { name: "Work Orders", path: "/company/work-orders" },
  { name: "Jobs", path: "/company/jobs" },
  { name: "Timesheets", path: "/company/timesheets" },
  { name: "Invoices", path: "/company/invoices" },
];

export default function CompanyTimesheets() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [timesheetFormOpen, setTimesheetFormOpen] = useState(false);

  const { data: timesheets = [], isLoading } = useTimesheets();
  const approveTimesheet = useApproveTimesheet();
  const rejectTimesheet = useRejectTimesheet();
  const { data: workOrders = [] } = useWorkOrders();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleCreateTimesheet = () => {
    setTimesheetFormOpen(true);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />
      <Navigation items={COMPANY_NAV_ITEMS} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Timesheets</h1>
            <p className="text-muted-foreground">Review and approve vendor timesheets</p>
          </div>
          <Button onClick={handleCreateTimesheet}>
            <Plus className="mr-2 h-4 w-4" />
            Create Timesheet
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by vendor or work order..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {["ALL", "SUBMITTED", "APPROVED", "REJECTED"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                onClick={() => setStatusFilter(status)}
                size="sm"
              >
                {status === "ALL" ? "All" : TIMESHEET_STATUS_LABELS[status as keyof typeof TIMESHEET_STATUS_LABELS]}
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
        ) : timesheets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No timesheets to review</h3>
              <p className="text-muted-foreground text-center">
                Submitted timesheets will appear here for your review
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {timesheets
              .filter((timesheet) =>
                statusFilter === "ALL" ? true : timesheet.status === statusFilter
              )
              .map((timesheet: Timesheet) => (
              <Card key={timesheet.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        Week of {formatDate(timesheet.weekStartDate)}
                      </CardTitle>
                      <CardDescription>
                        {formatDate(timesheet.weekStartDate)} - {formatDate(timesheet.weekEndDate)}
                      </CardDescription>
                    </div>
                    <Badge>{TIMESHEET_STATUS_LABELS[timesheet.status as keyof typeof TIMESHEET_STATUS_LABELS]}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span><span className="font-semibold">{timesheet.totalHours}</span> hours</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{timesheet.entries?.length || 0} entries</span>
                    </div>
                  </div>
                  
                  {timesheet.notes && (
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm text-muted-foreground">{timesheet.notes}</p>
                    </div>
                  )}

                  {timesheet.status === "SUBMITTED" && (
                    <div className="flex gap-2">
                      <Button 
                        variant="default" 
                        className="flex-1"
                        onClick={() => approveTimesheet.mutate(timesheet.id)}
                        disabled={approveTimesheet.isPending}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="flex-1"
                        onClick={() => rejectTimesheet.mutate(timesheet.id)}
                        disabled={rejectTimesheet.isPending}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <TimesheetFormDialog
        open={timesheetFormOpen}
        onOpenChange={setTimesheetFormOpen}
        workOrders={workOrders}
        isCompany={true}
      />
    </div>
  );
}
