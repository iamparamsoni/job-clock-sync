export type InvoiceStatus = "DRAFT" | "PENDING" | "APPROVED" | "PAID" | "REJECTED";

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  companyId: string;
  workOrderId: string;
  status: InvoiceStatus;
  totalAmount: number;
  taxAmount: number;
  subtotal: number;
  items: InvoiceItem[];
  dueDate?: string;
  paidDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  DRAFT: "Draft",
  PENDING: "Pending",
  APPROVED: "Approved",
  PAID: "Paid",
  REJECTED: "Rejected",
};
