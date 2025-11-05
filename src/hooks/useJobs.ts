import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Job } from "@/types/job";
import { toast } from "sonner";

export const useJobs = () => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: api.getJobs,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      title: string;
      description: string;
      location: string;
      employmentType: string;
      requiredSkills?: string[];
      salaryMin?: number;
      salaryMax?: number;
    }) => api.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job posted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create job");
    },
  });
};

export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.updateJobStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["jobs"] });
      const previousJobs = queryClient.getQueryData<Job[]>(["jobs"]);

      if (previousJobs) {
        queryClient.setQueryData<Job[]>(
          ["jobs"],
          previousJobs.map((job) =>
            job.id === id
              ? {
                  ...job,
                  status: status as Job["status"],
                  updatedAt: new Date().toISOString(),
                }
              : job
          )
        );
      }

      return { previousJobs };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job status updated");
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousJobs) {
        queryClient.setQueryData(["jobs"], context.previousJobs);
      }
      toast.error(error.message || "Failed to update status");
    },
  });
};

export const useApplyForJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.applyForJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Application submitted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to apply for job");
    },
  });
};
