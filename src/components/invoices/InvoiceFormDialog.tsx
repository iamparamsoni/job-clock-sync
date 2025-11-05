import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { invoiceFormSchema, InvoiceFormData } from "@/schemas/invoiceSchema";
import { useCreateInvoice } from "@/hooks/useInvoices";
import { WorkOrder } from "@/types/workOrder";
import { Loader2, Plus, Trash2, DollarSign } from "lucide-react";

interface InvoiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workOrders: WorkOrder[];
}

const TAX_RATE = 0.08; // 8% tax

export function InvoiceFormDialog({ open, onOpenChange, workOrders }: InvoiceFormDialogProps) {
  const createInvoice = useCreateInvoice();

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      workOrderId: "",
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
      dueDate: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    if (open) {
      form.reset({
        workOrderId: "",
        items: [{ description: "", quantity: 1, unitPrice: 0 }],
        dueDate: "",
      });
    }
  }, [open, form]);

  const onSubmit = async (data: InvoiceFormData) => {
    const payload = {
      workOrderId: data.workOrderId,
      items: data.items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      dueDate: data.dueDate || undefined,
    };

    createInvoice.mutate(payload, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset();
      },
    });
  };

  const handleAddItem = () => {
    append({ description: "", quantity: 1, unitPrice: 0 });
  };

  const calculateItemTotal = (index: number) => {
    const quantity = form.watch(`items.${index}.quantity`) || 0;
    const unitPrice = form.watch(`items.${index}.unitPrice`) || 0;
    return quantity * unitPrice;
  };

  const subtotal = fields.reduce((sum, _, index) => {
    return sum + calculateItemTotal(index);
  }, 0);

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
          <DialogDescription>
            Create an invoice for completed work with itemized charges
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <FormLabel>Line Items *</FormLabel>
                <Button type="button" onClick={handleAddItem} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[120px]">Quantity</TableHead>
                      <TableHead className="w-[140px]">Unit Price ($)</TableHead>
                      <TableHead className="w-[140px]">Total ($)</TableHead>
                      <TableHead className="w-[80px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Item description" {...field} className="h-9" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.1"
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
                            name={`items.${index}.unitPrice`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    className="h-9"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ${calculateItemTotal(index).toFixed(2)}
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

              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (8%):</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-primary">
                    <DollarSign className="inline h-5 w-5" />
                    {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createInvoice.isPending}>
                {createInvoice.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Invoice"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
