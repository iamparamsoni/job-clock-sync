import { z } from "zod";

export const timesheetEntrySchema = z.object({
  date: z.string().min(1, "Date is required"),
  hours: z.number().min(0.1, "Hours must be at least 0.1").max(24, "Hours cannot exceed 24"),
  description: z.string().min(3, "Description must be at least 3 characters").max(500, "Description must be less than 500 characters"),
  workOrderId: z.string().min(1, "Work order is required"),
});

export const timesheetFormSchema = z.object({
  workOrderId: z.string().min(1, "Work order is required"),
  vendorId: z.string().optional(), // For company creating on behalf of vendor
  weekStartDate: z.string().min(1, "Week start date is required"),
  weekEndDate: z.string().min(1, "Week end date is required"),
  entries: z.array(timesheetEntrySchema).min(1, "At least one entry is required"),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
}).refine(
  (data) => {
    const start = new Date(data.weekStartDate);
    const end = new Date(data.weekEndDate);
    return end >= start;
  },
  {
    message: "Week end date must be after or equal to week start date",
    path: ["weekEndDate"],
  }
);

export type TimesheetEntryData = z.infer<typeof timesheetEntrySchema>;
export type TimesheetFormData = z.infer<typeof timesheetFormSchema>;
