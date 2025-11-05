import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Invoice } from "@/types/invoice";
import { toast } from "sonner";

export const useInvoices = () => {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: api.getInvoices,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      workOrderId: string;
      items: Array<{
        description: string;
        quantity: number;
        unitPrice: number;
      }>;
      dueDate?: string;
    }) => api.createInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create invoice");
    },
  });
};

export const useSubmitInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.submitInvoice(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["invoices"] });
      const previousInvoices = queryClient.getQueryData<Invoice[]>(["invoices"]);

      if (previousInvoices) {
        queryClient.setQueryData<Invoice[]>(
          ["invoices"],
          previousInvoices.map((invoice) =>
            invoice.id === id
              ? {
                  ...invoice,
                  status: "PENDING" as Invoice["status"],
                  updatedAt: new Date().toISOString(),
                }
              : invoice
          )
        );
      }

      return { previousInvoices };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice submitted successfully");
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousInvoices) {
        queryClient.setQueryData(["invoices"], context.previousInvoices);
      }
      toast.error(error.message || "Failed to submit invoice");
    },
  });
};

export const useApproveInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.approveInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice approved");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to approve invoice");
    },
  });
};

export const useRejectInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.rejectInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice rejected");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reject invoice");
    },
  });
};

export const useMarkInvoiceAsPaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.markInvoiceAsPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice marked as paid");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to mark invoice as paid");
    },
  });
};
