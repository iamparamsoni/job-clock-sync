export type WorkOrderStatus = 
  | "DRAFT" 
  | "OPEN" 
  | "ASSIGNED" 
  | "IN_PROGRESS" 
  | "COMPLETED" 
  | "CANCELLED";

export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  title: string;
  description: string;
  companyId: string;
  vendorId?: string;
  status: WorkOrderStatus;
  assignedDate?: string;
  dueDate?: string;
  completedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const WORK_ORDER_STATUS_LABELS: Record<WorkOrderStatus, string> = {
  DRAFT: "Draft",
  OPEN: "Open",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const WORK_ORDER_STATUS_VARIANTS: Record<WorkOrderStatus, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "outline",
  OPEN: "secondary",
  ASSIGNED: "default",
  IN_PROGRESS: "default",
  COMPLETED: "secondary",
  CANCELLED: "destructive",
};
