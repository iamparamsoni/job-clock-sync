import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, WorkOrder } from "@/lib/api";
import { toast } from "sonner";

export const useWorkOrders = () => {
  return useQuery({
    queryKey: ["workOrders"],
    queryFn: api.getWorkOrders,
  });
};

export const useCreateWorkOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { 
      title: string; 
      description: string; 
      dueDate?: string;
      vendorId?: string;
    }) =>
      api.createWorkOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      toast.success("Work order created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create work order");
    },
  });
};

export const useUpdateWorkOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.updateWorkOrderStatus(id, status),
    onMutate: async ({ id, status }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ["workOrders"] });

      // Snapshot previous value
      const previousWorkOrders = queryClient.getQueryData<WorkOrder[]>(["workOrders"]);

      // Optimistically update
      if (previousWorkOrders) {
        queryClient.setQueryData<WorkOrder[]>(
          ["workOrders"],
          previousWorkOrders.map((wo) =>
            wo.id === id
              ? {
                  ...wo,
                  status: status as WorkOrder["status"],
                  updatedAt: new Date().toISOString(),
                  ...(status === "COMPLETED" ? { completedDate: new Date().toISOString() } : {}),
                }
              : wo
          )
        );
      }

      return { previousWorkOrders };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      toast.success("Work order status updated");
    },
    onError: (error: Error, _variables, context) => {
      // Rollback on error
      if (context?.previousWorkOrders) {
        queryClient.setQueryData(["workOrders"], context.previousWorkOrders);
      }
      toast.error(error.message || "Failed to update status");
    },
  });
};

export const useAssignWorkOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, vendorId }: { id: string; vendorId: string }) =>
      api.assignWorkOrder(id, vendorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      toast.success("Work order assigned successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to assign work order");
    },
  });
};
