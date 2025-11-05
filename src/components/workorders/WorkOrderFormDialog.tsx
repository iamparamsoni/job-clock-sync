import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { workOrderFormSchema, WorkOrderFormData } from "@/schemas/workOrderSchema";
import { useCreateWorkOrder } from "@/hooks/useWorkOrders";
import { UserResponse, api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface WorkOrderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WorkOrderFormDialog({ open, onOpenChange }: WorkOrderFormDialogProps) {
  const [vendors, setVendors] = useState<UserResponse[]>([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const createWorkOrder = useCreateWorkOrder();

  const form = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderFormSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      vendorId: "",
    },
  });

  useEffect(() => {
    if (open) {
      fetchVendors();
      form.reset({
        title: "",
        description: "",
        dueDate: "",
        vendorId: "",
      });
    }
  }, [open, form]);

  const fetchVendors = async () => {
    setLoadingVendors(true);
    try {
      const data = await api.getVendors();
      setVendors(data);
    } catch (error) {
      toast.error("Failed to load vendors");
      console.error(error);
    } finally {
      setLoadingVendors(false);
    }
  };

  const onSubmit = async (data: WorkOrderFormData) => {
    const payload = {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate || undefined,
      vendorId: data.vendorId || undefined,
    };

    createWorkOrder.mutate(payload, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle>Create New Work Order</DialogTitle>
          <DialogDescription>
            Fill in the details to create a work order. Optionally assign it to a vendor.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Electrical Maintenance - Building A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide detailed description of the work order requirements..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date (Optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>Leave empty if no due date</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vendorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign to Vendor (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={loadingVendors}>
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder={loadingVendors ? "Loading vendors..." : "Select a vendor (optional)"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="">No vendor (assign later)</SelectItem>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.email} - {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    You can assign a vendor now or leave it unassigned
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createWorkOrder.isPending}>
                {createWorkOrder.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Work Order"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
