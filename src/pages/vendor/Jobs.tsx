import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Briefcase, MapPin, DollarSign, Clock } from "lucide-react";
import { JOB_STATUS_LABELS, EMPLOYMENT_TYPE_LABELS, Job } from "@/types/job";
import { useJobs, useApplyForJob } from "@/hooks/useJobs";

const VENDOR_NAV_ITEMS = [
  { name: "Dashboard", path: "/vendor/dashboard" },
  { name: "Work Orders", path: "/vendor/work-orders" },
  { name: "Jobs", path: "/vendor/jobs" },
  { name: "Timesheets", path: "/vendor/timesheets" },
  { name: "Invoices", path: "/vendor/invoices" },
];

export default function VendorJobs() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");

  const { data: jobs = [], isLoading } = useJobs();
  const applyForJob = useApplyForJob();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />
      <Navigation items={VENDOR_NAV_ITEMS} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Available Jobs</h1>
          <p className="text-muted-foreground">Browse and apply for job opportunities</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs by title, skills, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {["ALL", "FULL_TIME", "PART_TIME", "CONTRACT"].map((type) => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                onClick={() => setFilterType(type)}
                size="sm"
              >
                {type === "ALL" ? "All" : EMPLOYMENT_TYPE_LABELS[type as keyof typeof EMPLOYMENT_TYPE_LABELS]}
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
        ) : jobs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No jobs available</h3>
              <p className="text-muted-foreground text-center">
                Check back later for new opportunities
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobs
              .filter((job) =>
                filterType === "ALL" ? true : job.employmentType === filterType
              )
              .filter((job) =>
                searchQuery
                  ? job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    job.requiredSkills?.some((skill) =>
                      skill.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                  : true
              )
              .map((job: Job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline">
                          <Briefcase className="mr-1 h-3 w-3" />
                          {EMPLOYMENT_TYPE_LABELS[job.employmentType as keyof typeof EMPLOYMENT_TYPE_LABELS]}
                        </Badge>
                        <Badge variant="outline">
                          <MapPin className="mr-1 h-3 w-3" />
                          {job.location}
                        </Badge>
                        {job.salaryMin && job.salaryMax && (
                          <Badge variant="outline">
                            <DollarSign className="mr-1 h-3 w-3" />
                            ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                          </Badge>
                        )}
                        <Badge variant="outline">
                          <Clock className="mr-1 h-3 w-3" />
                          Posted {new Date(job.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription>{job.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.requiredSkills?.map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => applyForJob.mutate(job.id)}
                      disabled={job.applicantIds?.includes(user?.id || "")}
                    >
                      {job.applicantIds?.includes(user?.id || "") ? "Applied" : "Apply for this Position"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
