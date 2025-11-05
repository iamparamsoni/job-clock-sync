import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { timesheetFormSchema, TimesheetFormData } from "@/schemas/timesheetSchema";
import { useCreateTimesheet } from "@/hooks/useTimesheets";
import { WorkOrder } from "@/types/workOrder";
import { UserResponse, api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface TimesheetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workOrders: WorkOrder[];
  isCompany?: boolean; // If true, show vendor selector
}

export function TimesheetFormDialog({ open, onOpenChange, workOrders, isCompany = false }: TimesheetFormDialogProps) {
  const [vendors, setVendors] = useState<UserResponse[]>([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const createTimesheet = useCreateTimesheet();

  const form = useForm<TimesheetFormData>({
    resolver: zodResolver(timesheetFormSchema),
    defaultValues: {
      workOrderId: "",
      vendorId: "",
      weekStartDate: "",
      weekEndDate: "",
      entries: [{ date: "", hours: 0, description: "", workOrderId: "" }],
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "entries",
  });

  useEffect(() => {
    if (open) {
      if (isCompany) {
        fetchVendors();
      }
      form.reset({
        workOrderId: "",
        vendorId: "",
        weekStartDate: "",
        weekEndDate: "",
        entries: [{ date: "", hours: 0, description: "", workOrderId: "" }],
        notes: "",
      });
    }
  }, [open, isCompany, form]);

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

  const onSubmit = async (data: TimesheetFormData) => {
    const workOrderId = data.workOrderId;
    
    // Update all entries with the selected workOrderId
    const entries = data.entries.map(entry => ({
      date: entry.date,
      hours: entry.hours,
      description: entry.description,
      workOrderId: workOrderId,
    }));

    const payload = {
      workOrderId: workOrderId,
      weekStartDate: data.weekStartDate,
      weekEndDate: data.weekEndDate,
      entries: entries,
      notes: data.notes || undefined,
      vendorId: isCompany && data.vendorId ? data.vendorId : undefined,
    };

    createTimesheet.mutate(payload, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset();
      },
    });
  };

  const handleAddEntry = () => {
    append({ date: "", hours: 0, description: "", workOrderId: "" });
  };

  const totalHours = fields.reduce((sum, _, index) => {
    const hours = form.watch(`entries.${index}.hours`) || 0;
    return sum + hours;
  }, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle>{isCompany ? "Create Timesheet for Vendor" : "Create Timesheet"}</DialogTitle>
          <DialogDescription>
            {isCompany 
              ? "Fill in the timesheet details for a vendor" 
              : "Log your work hours for the selected work order"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {isCompany && (
              <FormField
                control={form.control}
                name="vendorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={loadingVendors}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder={loadingVendors ? "Loading vendors..." : "Select vendor"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover z-50">
                        {vendors.map((vendor) => (
                          <SelectItem key={vendor.id} value={vendor.id}>
                            {vendor.email} - {vendor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="workOrderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Order *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select work order" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover z-50">
                      {workOrders.map((wo) => (
                        <SelectItem key={wo.id} value={wo.id}>
                          {wo.workOrderNumber} - {wo.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weekStartDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Week Start Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weekEndDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Week End Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <FormLabel>Time Entries *</FormLabel>
                <Button type="button" onClick={handleAddEntry} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Entry
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Date</TableHead>
                      <TableHead className="w-[120px]">Hours</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[80px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`entries.${index}.date`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input type="date" {...field} className="h-9" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`entries.${index}.hours`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.5"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    className="h-9"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`entries.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="What did you work on?" {...field} className="h-9" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            disabled={fields.length === 1}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="text-right text-sm font-semibold">
                Total Hours: <span className="text-primary">{totalHours.toFixed(2)}</span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes or comments..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createTimesheet.isPending}>
                {createTimesheet.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Timesheet"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
