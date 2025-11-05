import { z } from "zod";

export const invoiceItemSchema = z.object({
  description: z.string().min(3, "Description must be at least 3 characters").max(500, "Description must be less than 500 characters"),
  quantity: z.number().min(0.1, "Quantity must be at least 0.1"),
  unitPrice: z.number().min(0.01, "Unit price must be at least 0.01"),
});

export const invoiceFormSchema = z.object({
  workOrderId: z.string().min(1, "Work order is required"),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
  dueDate: z.string().optional(),
});

export type InvoiceItemData = z.infer<typeof invoiceItemSchema>;
export type InvoiceFormData = z.infer<typeof invoiceFormSchema>;
