import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Clock, Calendar, FileText, Send } from "lucide-react";
import { TIMESHEET_STATUS_LABELS, Timesheet } from "@/types/timesheet";
import { format } from "date-fns";
import { useTimesheets, useSubmitTimesheet } from "@/hooks/useTimesheets";
import { TimesheetFormDialog } from "@/components/timesheets/TimesheetFormDialog";
import { useWorkOrders } from "@/hooks/useWorkOrders";

const VENDOR_NAV_ITEMS = [
  { name: "Dashboard", path: "/vendor/dashboard" },
  { name: "Work Orders", path: "/vendor/work-orders" },
  { name: "Jobs", path: "/vendor/jobs" },
  { name: "Timesheets", path: "/vendor/timesheets" },
  { name: "Invoices", path: "/vendor/invoices" },
];

export default function VendorTimesheets() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [timesheetFormOpen, setTimesheetFormOpen] = useState(false);

  const { data: timesheets = [], isLoading } = useTimesheets();
  const submitTimesheet = useSubmitTimesheet();
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
      <Navigation items={VENDOR_NAV_ITEMS} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Timesheets</h1>
            <p className="text-muted-foreground">Submit and track your work hours</p>
          </div>
          <Button onClick={handleCreateTimesheet}>
            <Plus className="mr-2 h-4 w-4" />
            New Timesheet
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          {["ALL", "DRAFT", "SUBMITTED", "APPROVED", "REJECTED"].map((status) => (
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
        ) : timesheets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No timesheets yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first timesheet to start tracking hours
              </p>
              <Button onClick={handleCreateTimesheet}>
                <Plus className="mr-2 h-4 w-4" />
                New Timesheet
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {timesheets
              .filter((timesheet) =>
                statusFilter === "ALL" ? true : timesheet.status === statusFilter
              )
              .map((timesheet: Timesheet) => (
              <Card key={timesheet.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">Week of {formatDate(timesheet.weekStartDate)}</CardTitle>
                    <Badge>{TIMESHEET_STATUS_LABELS[timesheet.status as keyof typeof TIMESHEET_STATUS_LABELS]}</Badge>
                  </div>
                  <CardDescription>
                    {formatDate(timesheet.weekStartDate)} - {formatDate(timesheet.weekEndDate)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{timesheet.totalHours} hours</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{timesheet.entries?.length || 0} entries</span>
                  </div>
                  {timesheet.submittedDate && (
                    <p className="text-xs text-muted-foreground">
                      Submitted: {formatDate(timesheet.submittedDate)}
                    </p>
                  )}
                  {timesheet.approvedDate && (
                    <p className="text-xs text-muted-foreground">
                      Approved: {formatDate(timesheet.approvedDate)}
                    </p>
                  )}
                  
                  {timesheet.status === "DRAFT" && (
                    <Button 
                      className="w-full mt-2" 
                      size="sm"
                      onClick={() => submitTimesheet.mutate(timesheet.id)}
                      disabled={submitTimesheet.isPending}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Submit for Approval
                    </Button>
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
        isCompany={false}
      />
    </div>
  );
}
