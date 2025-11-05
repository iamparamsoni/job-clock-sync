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
import { Plus, Search, Briefcase, MapPin, DollarSign, Users, Edit, Eye } from "lucide-react";
import { JOB_STATUS_LABELS, EMPLOYMENT_TYPE_LABELS, Job } from "@/types/job";
import { useJobs, useUpdateJobStatus } from "@/hooks/useJobs";
import { JobFormDialog } from "@/components/jobs/JobFormDialog";
import { JobApplicantsDialog } from "@/components/jobs/JobApplicantsDialog";

const COMPANY_NAV_ITEMS = [
  { name: "Dashboard", path: "/company/dashboard" },
  { name: "Work Orders", path: "/company/work-orders" },
  { name: "Jobs", path: "/company/jobs" },
  { name: "Timesheets", path: "/company/timesheets" },
  { name: "Invoices", path: "/company/invoices" },
];

export default function CompanyJobs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [jobFormOpen, setJobFormOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applicantsDialogOpen, setApplicantsDialogOpen] = useState(false);
  const [applicantsJobId, setApplicantsJobId] = useState<string | null>(null);
  const [applicantsJobTitle, setApplicantsJobTitle] = useState("");

  const { data: jobs = [], isLoading } = useJobs();
  const updateJobStatus = useUpdateJobStatus();

  const handleLogout = () => {
    navigate("/");
  };

  const handleCreateJob = () => {
    setSelectedJob(null);
    setJobFormOpen(true);
  };

  const handleEditJob = (job: Job, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedJob(job);
    setJobFormOpen(true);
  };

  const handleViewApplicants = (job: Job, e: React.MouseEvent) => {
    e.stopPropagation();
    setApplicantsJobId(job.id);
    setApplicantsJobTitle(job.title);
    setApplicantsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />
      <Navigation items={COMPANY_NAV_ITEMS} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Job Postings</h1>
            <p className="text-muted-foreground">Manage your open positions and applicants</p>
          </div>
          <Button onClick={handleCreateJob}>
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {["ALL", "OPEN", "FILLED", "CLOSED"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                onClick={() => setStatusFilter(status)}
                size="sm"
              >
                {status === "ALL" ? "All" : JOB_STATUS_LABELS[status as keyof typeof JOB_STATUS_LABELS]}
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
              <h3 className="text-lg font-semibold mb-2">No jobs posted yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Start by posting your first job opening
              </p>
              <Button onClick={handleCreateJob}>
                <Plus className="mr-2 h-4 w-4" />
                Post New Job
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobs
              .filter((job) =>
                statusFilter === "ALL" ? true : job.status === statusFilter
              )
              .filter((job) =>
                searchQuery
                  ? job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchQuery.toLowerCase())
                  : true
              )
              .map((job: Job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow cursor-pointer">
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
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer hover:bg-accent"
                          onClick={(e) => handleViewApplicants(job, e)}
                        >
                          <Users className="mr-1 h-3 w-3" />
                          {job.applicantIds?.length || 0} applicants
                        </Badge>
                      </div>
                    </div>
                    <Badge>{JOB_STATUS_LABELS[job.status as keyof typeof JOB_STATUS_LABELS]}</Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{job.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills?.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => handleEditJob(job, e)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => handleViewApplicants(job, e)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Applicants
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <JobFormDialog
        open={jobFormOpen}
        onOpenChange={setJobFormOpen}
        job={selectedJob}
      />

      <JobApplicantsDialog
        open={applicantsDialogOpen}
        onOpenChange={setApplicantsDialogOpen}
        jobId={applicantsJobId}
        jobTitle={applicantsJobTitle}
      />
    </div>
  );
}
