import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { UserResponse } from "@/lib/api";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Users } from "lucide-react";

interface JobApplicantsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string | null;
  jobTitle: string;
}

export function JobApplicantsDialog({ open, onOpenChange, jobId, jobTitle }: JobApplicantsDialogProps) {
  const [applicants, setApplicants] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && jobId) {
      fetchApplicants();
    }
  }, [open, jobId]);

  const fetchApplicants = async () => {
    if (!jobId) return;

    setIsLoading(true);
    try {
      const data = await api.getJobApplicants(jobId);
      setApplicants(data);
    } catch (error) {
      toast.error("Failed to load applicants");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-background">
        <DialogHeader>
          <DialogTitle>Job Applicants</DialogTitle>
          <DialogDescription>
            Applicants for: {jobTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : applicants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No applicants yet</h3>
              <p className="text-sm text-muted-foreground">
                This job hasn't received any applications yet
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applicants.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell className="font-medium">{applicant.name}</TableCell>
                    <TableCell>{applicant.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {applicant.role.charAt(0).toUpperCase() + applicant.role.slice(1).toLowerCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
