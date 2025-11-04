const API_BASE_URL = "http://localhost:8082/api";

// Token management
const TOKEN_KEY = "hourglass_token";
const USER_KEY = "hourglass_user";

export const tokenStorage = {
  get: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
  set: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  remove: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },
  exists: (): boolean => {
    return localStorage.getItem(TOKEN_KEY) !== null;
  },
};

// Helper function to create headers with authentication
const createAuthHeaders = (includeAuth: boolean = true): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = tokenStorage.get();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

export interface LoginResponse {
  token: string;
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
}

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

export interface DashboardStats {
  activeJobs?: number;
  workOrdersInProgress?: number;
  totalHours?: number;
  pendingInvoicesAmount?: number;
  activeVendors?: number;
  openPositions?: number;
  workOrdersInProgressCompany?: number;
  monthlySpend?: number;
}

export const api = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: createAuthHeaders(false),
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Login failed" }));
        throw new Error(error.error || "Login failed");
      }

      const data = await response.json();
      
      if (data.token) {
        tokenStorage.set(data.token);
      }
      
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error("Unable to connect to server. Please ensure the backend is running on port 8082.");
      }
      throw error;
    }
  },

  getCurrentUser: async (): Promise<UserResponse> => {
    const token = tokenStorage.get();
    if (!token) {
      throw new Error("No token found. Please login again.");
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: createAuthHeaders(true),
    });

    if (!response.ok) {
      if (response.status === 401) {
        tokenStorage.remove();
        localStorage.removeItem(USER_KEY);
        throw new Error("Session expired. Please login again.");
      }
      throw new Error("Failed to fetch user");
    }

    return response.json();
  },

  // Work Orders
  getWorkOrders: async (): Promise<WorkOrder[]> => {
    return api.authenticatedRequest<WorkOrder[]>("/work-orders");
  },

  createWorkOrder: async (workOrder: {
    title: string;
    description: string;
    dueDate?: string;
    vendorId?: string;
  }): Promise<WorkOrder> => {
    return api.authenticatedRequest<WorkOrder>("/work-orders", {
      method: "POST",
      body: JSON.stringify(workOrder),
    });
  },

  updateWorkOrderStatus: async (id: string, status: string): Promise<WorkOrder> => {
    return api.authenticatedRequest<WorkOrder>(`/work-orders/${id}/status?status=${status}`, {
      method: "PUT",
    });
  },

  assignWorkOrder: async (id: string, vendorId: string): Promise<WorkOrder> => {
    return api.authenticatedRequest<WorkOrder>(`/work-orders/${id}/assign?vendorId=${vendorId}`, {
      method: "PUT",
    });
  },

  // Dashboard stats
  getVendorStats: async (): Promise<DashboardStats> => {
    return api.authenticatedRequest<DashboardStats>("/dashboard/vendor/stats");
  },

  getCompanyStats: async (): Promise<DashboardStats> => {
    return api.authenticatedRequest<DashboardStats>("/dashboard/company/stats");
  },

  // Generic authenticated request helper
  authenticatedRequest: async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const token = tokenStorage.get();
    if (!token) {
      throw new Error("No token found. Please login again.");
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...createAuthHeaders(true),
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        tokenStorage.remove();
        localStorage.removeItem(USER_KEY);
        throw new Error("Session expired. Please login again.");
      }
      const error = await response.json().catch(() => ({ error: "Request failed" }));
      throw new Error(error.error || "Request failed");
    }

    return response.json();
  },
};

