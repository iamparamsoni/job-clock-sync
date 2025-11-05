export type JobStatus = "DRAFT" | "OPEN" | "CLOSED" | "FILLED";
export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT";

export interface Job {
  id: string;
  title: string;
  description: string;
  companyId: string;
  status: JobStatus;
  requiredSkills: string[];
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  employmentType: EmploymentType;
  applicantIds: string[];
  createdAt: string;
  updatedAt: string;
}

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  DRAFT: "Draft",
  OPEN: "Open",
  CLOSED: "Closed",
  FILLED: "Filled",
};

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
};
