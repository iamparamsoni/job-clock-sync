import { z } from "zod";

export const jobFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description must be less than 2000 characters"),
  location: z.string().min(2, "Location is required").max(100, "Location must be less than 100 characters"),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT"], {
    required_error: "Please select an employment type",
  }),
  requiredSkills: z.array(z.string()).min(1, "At least one skill is required").max(20, "Maximum 20 skills allowed"),
  salaryMin: z.number().min(0, "Minimum salary must be positive").optional().or(z.literal(0)),
  salaryMax: z.number().min(0, "Maximum salary must be positive").optional().or(z.literal(0)),
  status: z.enum(["DRAFT", "OPEN", "CLOSED", "FILLED"]).default("DRAFT"),
}).refine(
  (data) => {
    if (data.salaryMin && data.salaryMax) {
      return data.salaryMax >= data.salaryMin;
    }
    return true;
  },
  {
    message: "Maximum salary must be greater than or equal to minimum salary",
    path: ["salaryMax"],
  }
);

export type JobFormData = z.infer<typeof jobFormSchema>;
