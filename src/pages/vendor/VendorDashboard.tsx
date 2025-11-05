import { Briefcase, FileText, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

const VENDOR_NAV_ITEMS = [
  { name: "Dashboard", path: "/vendor/dashboard" },
  { name: "Work Orders", path: "/vendor/work-orders" },
  { name: "Jobs", path: "/vendor/jobs" },
  { name: "Timesheets", path: "/vendor/timesheets" },
  { name: "Invoices", path: "/vendor/invoices" },
];

const VendorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    {
      title: "Active Jobs",
      value: "0",
      description: "Currently applied",
      icon: Briefcase,
    },
    {
      title: "Work Orders",
      value: "0",
      description: "In progress",
      icon: FileText,
    },
    {
      title: "Hours Logged",
      value: "0",
      description: "This month",
      icon: Clock,
    },
    {
      title: "Pending Invoices",
      value: "$0",
      description: "Awaiting payment",
      icon: DollarSign,
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getVendorStats();
        setStats([
          {
            title: "Active Jobs",
            value: String(data.activeJobs || 0),
            description: "Currently applied",
            icon: Briefcase,
          },
          {
            title: "Work Orders",
            value: String(data.workOrdersInProgress || 0),
            description: "In progress",
            icon: FileText,
          },
          {
            title: "Hours Logged",
            value: String(data.totalHours?.toFixed(0) || 0),
            description: "This month",
            icon: Clock,
          },
          {
            title: "Pending Invoices",
            value: `$${data.pendingInvoicesAmount?.toFixed(2) || "0.00"}`,
            description: "Awaiting payment",
            icon: DollarSign,
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch vendor stats:", error);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />
      <Navigation items={VENDOR_NAV_ITEMS} />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">Here's what's happening with your work today.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest work updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "Timesheet submitted for Week 45",
                  "New work order assigned: WO-2024-156",
                  "Applied to: Senior Developer Position",
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span>{activity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>Tasks requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "Submit timesheet by Nov 15",
                  "Complete work order WO-2024-145",
                  "Invoice payment due Nov 20",
                ].map((deadline, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                    <span>{deadline}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default VendorDashboard;
