import { Users, Briefcase, FileText, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

const COMPANY_NAV_ITEMS = [
  { name: "Dashboard", path: "/company/dashboard" },
  { name: "Work Orders", path: "/company/work-orders" },
  { name: "Jobs", path: "/company/jobs" },
  { name: "Timesheets", path: "/company/timesheets" },
  { name: "Invoices", path: "/company/invoices" },
];

const CompanyDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    {
      title: "Active Vendors",
      value: "0",
      description: "Currently working",
      icon: Users,
    },
    {
      title: "Open Positions",
      value: "0",
      description: "Seeking candidates",
      icon: Briefcase,
    },
    {
      title: "Work Orders",
      value: "0",
      description: "In progress",
      icon: FileText,
    },
    {
      title: "Monthly Spend",
      value: "$0",
      description: "This month",
      icon: DollarSign,
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        return; // Don't fetch if user is not available
      }

      try {
        const data = await api.getCompanyStats();
        setStats([
          {
            title: "Active Vendors",
            value: String(data.activeVendors || 0),
            description: "Currently working",
            icon: Users,
          },
          {
            title: "Open Positions",
            value: String(data.openPositions || 0),
            description: "Seeking candidates",
            icon: Briefcase,
          },
          {
            title: "Work Orders",
            value: String(data.workOrdersInProgressCompany || 0),
            description: "In progress",
            icon: FileText,
          },
          {
            title: "Monthly Spend",
            value: `$${data.monthlySpend?.toFixed(2) || "0.00"}`,
            description: "This month",
            icon: DollarSign,
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch company stats:", error);
      }
    };

    fetchStats();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />
      <Navigation items={COMPANY_NAV_ITEMS} />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Welcome back, Company</h1>
          <p className="text-muted-foreground">Here's your company overview for today.</p>
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
              <CardTitle>Recent Job Posts</CardTitle>
              <CardDescription>Latest positions published</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "Senior Full Stack Developer - 12 applications",
                  "Project Manager - 8 applications",
                  "UX Designer - 15 applications",
                ].map((job, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span>{job}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Items requiring your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "3 timesheets awaiting approval",
                  "5 invoices pending review",
                  "2 work orders need assignment",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                    <span>{item}</span>
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

export default CompanyDashboard;
