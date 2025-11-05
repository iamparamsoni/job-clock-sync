import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Timesheet } from "@/types/timesheet";
import { toast } from "sonner";

export const useTimesheets = () => {
  return useQuery({
    queryKey: ["timesheets"],
    queryFn: api.getTimesheets,
  });
};

export const useCreateTimesheet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      workOrderId: string;
      weekStartDate: string;
      weekEndDate: string;
      entries: Array<{
        date: string;
        hours: number;
        description: string;
        workOrderId: string;
      }>;
      notes?: string;
      vendorId?: string; // For company creating on behalf of vendor
    }) => api.createTimesheet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timesheets"] });
      toast.success("Timesheet created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create timesheet");
    },
  });
};

export const useSubmitTimesheet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.submitTimesheet(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["timesheets"] });
      const previousTimesheets = queryClient.getQueryData<Timesheet[]>(["timesheets"]);

      if (previousTimesheets) {
        queryClient.setQueryData<Timesheet[]>(
          ["timesheets"],
          previousTimesheets.map((timesheet) =>
            timesheet.id === id
              ? {
                  ...timesheet,
                  status: "SUBMITTED" as Timesheet["status"],
                  submittedDate: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }
              : timesheet
          )
        );
      }

      return { previousTimesheets };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timesheets"] });
      toast.success("Timesheet submitted successfully");
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousTimesheets) {
        queryClient.setQueryData(["timesheets"], context.previousTimesheets);
      }
      toast.error(error.message || "Failed to submit timesheet");
    },
  });
};

export const useApproveTimesheet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.approveTimesheet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timesheets"] });
      toast.success("Timesheet approved");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to approve timesheet");
    },
  });
};

export const useRejectTimesheet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.rejectTimesheet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timesheets"] });
      toast.success("Timesheet rejected");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reject timesheet");
    },
  });
};
