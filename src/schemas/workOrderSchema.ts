import { z } from "zod";

export const workOrderFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title must be less than 200 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description must be less than 2000 characters"),
  dueDate: z.string().optional(),
  vendorId: z.string().optional(),
});

export type WorkOrderFormData = z.infer<typeof workOrderFormSchema>;
