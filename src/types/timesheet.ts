export type TimesheetStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";

export interface TimesheetEntry {
  date: string;
  hours: number;
  description: string;
  workOrderId: string;
}

export interface Timesheet {
  id: string;
  vendorId: string;
  companyId: string;
  workOrderId: string;
  status: TimesheetStatus;
  weekStartDate: string;
  weekEndDate: string;
  entries: TimesheetEntry[];
  totalHours: number;
  notes?: string;
  submittedDate?: string;
  approvedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const TIMESHEET_STATUS_LABELS: Record<TimesheetStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};
