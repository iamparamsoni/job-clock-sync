import { z } from "zod";

export const workOrderSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(200, { message: "Title must be less than 200 characters" }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Description is required" })
    .max(2000, { message: "Description must be less than 2000 characters" }),
  dueDate: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        return new Date(date) > new Date();
      },
      { message: "Due date must be in the future" }
    ),
});

export type WorkOrderFormData = z.infer<typeof workOrderSchema>;
