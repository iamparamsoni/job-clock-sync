# Frontend Integration Guide for Lovable

## Overview

This guide provides all the information needed to build the frontend for Job Clock Sync using Lovable. The backend API is fully implemented with JWT authentication, role-based access control, and comprehensive endpoints.

---

## Table of Contents

1. [Authentication Flow](#authentication-flow)
2. [User Roles & Permissions](#user-roles--permissions)
3. [API Endpoints Reference](#api-endpoints-reference)
4. [Data Models](#data-models)
5. [Workflow Examples](#workflow-examples)
6. [Frontend Features by Role](#frontend-features-by-role)
7. [API Integration Tips](#api-integration-tips)
8. [Error Handling](#error-handling)

---

## Authentication Flow

### Login Process

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "VENDOR"
}
```

### Token Management

1. **Store token** in localStorage: `localStorage.setItem('token', response.token)`
2. **Include in all requests**: `Authorization: Bearer <token>`
3. **Token expires** in 24 hours
4. **Get current user**: `GET /api/auth/me` to verify token and get user details

### Authentication Hook Example

```typescript
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, ...userData } = response.data;
    
    localStorage.setItem('token', token);
    setToken(token);
    setUser(userData);
    
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return { user, token, login, logout };
};
```

---

## User Roles & Permissions

### VENDOR Role

**Capabilities:**
- ✅ View dashboard with active jobs, work orders, timesheets, invoices
- ✅ Browse and apply for job postings
- ✅ View assigned work orders
- ✅ Create and submit timesheets
- ✅ Submit invoices
- ❌ Cannot create jobs or work orders
- ❌ Cannot approve timesheets or invoices

### COMPANY Role

**Capabilities:**
- ✅ View dashboard with vendors, jobs, work orders, timesheets, invoices
- ✅ Create and publish job postings
- ✅ Create work orders and assign to vendors
- ✅ Review and approve/reject timesheets
- ✅ Create timesheets on behalf of vendors
- ✅ Review and approve/reject invoices
- ❌ Cannot apply for jobs
- ❌ Cannot submit timesheets for themselves

### ADMIN Role

**Capabilities:**
- ✅ All VENDOR and COMPANY permissions
- ✅ Manage users (create, update, delete)
- ✅ Change user roles
- ✅ Enable/disable user accounts
- ✅ View all users by role
- ✅ Full system access

---

## API Endpoints Reference

### Base URL
```
Local Development: http://localhost:8082/api
Production: https://api.hourglass.com
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | Login and get JWT token | No |
| GET | `/auth/me` | Get current user details | Yes |

### User Management (Admin Only)

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/users` | Get all users | ADMIN |
| POST | `/users` | Create new user | ADMIN |
| GET | `/users/{id}` | Get user by ID | ADMIN |
| PUT | `/users/{id}` | Update user | ADMIN |
| DELETE | `/users/{id}` | Delete user | ADMIN |
| GET | `/users/role/{role}` | Get users by role | ADMIN |
| POST | `/users/{id}/toggle-status` | Enable/disable user | ADMIN |

### Dashboard Endpoints

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/dashboard/vendor/stats` | Vendor dashboard statistics | VENDOR |
| GET | `/dashboard/company/stats` | Company dashboard statistics | COMPANY |

### Job Endpoints

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/jobs` | Get jobs (role-based) | All |
| POST | `/jobs` | Create job posting | COMPANY |
| PUT | `/jobs/{id}` | Update job | COMPANY |
| PUT | `/jobs/{id}/status` | Update job status | COMPANY |
| POST | `/jobs/{id}/apply` | Apply for job | VENDOR |

### Work Order Endpoints

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/work-orders` | Get work orders (role-based) | All |
| POST | `/work-orders` | Create work order | COMPANY |
| PUT | `/work-orders/{id}/status` | Update status | All |
| PUT | `/work-orders/{id}/assign` | Assign to vendor | COMPANY |

### Timesheet Endpoints

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/timesheets` | Get timesheets (role-based) | All |
| POST | `/timesheets` | Create timesheet | VENDOR or COMPANY* |
| POST | `/timesheets/{id}/submit` | Submit for approval | VENDOR |
| POST | `/timesheets/{id}/approve` | Approve timesheet | COMPANY |
| POST | `/timesheets/{id}/reject` | Reject timesheet | COMPANY |

*COMPANY can create on behalf of vendor by including `vendorId` in request

### Invoice Endpoints

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/invoices` | Get invoices (role-based) | All |
| POST | `/invoices` | Create invoice | VENDOR |
| POST | `/invoices/{id}/submit` | Submit for approval | VENDOR |
| POST | `/invoices/{id}/approve` | Approve invoice | COMPANY |
| POST | `/invoices/{id}/reject` | Reject invoice | COMPANY |
| POST | `/invoices/{id}/pay` | Mark as paid | COMPANY |

---

## Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'VENDOR' | 'COMPANY' | 'ADMIN';
  active: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Job
```typescript
interface Job {
  id: string;
  title: string;
  description: string;
  companyId: string;
  status: 'DRAFT' | 'OPEN' | 'CLOSED' | 'FILLED';
  requiredSkills: string[];
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  applicantIds: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Work Order
```typescript
interface WorkOrder {
  id: string;
  workOrderNumber: string; // e.g., "WO-1730123456"
  title: string;
  description: string;
  companyId: string;
  vendorId?: string;
  status: 'DRAFT' | 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  assignedDate?: string;
  dueDate?: string;
  completedDate?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Timesheet
```typescript
interface Timesheet {
  id: string;
  vendorId: string;
  companyId: string;
  workOrderId: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  weekStartDate: string; // YYYY-MM-DD
  weekEndDate: string; // YYYY-MM-DD
  entries: TimesheetEntry[];
  totalHours: number;
  notes?: string;
  submittedDate?: string;
  approvedDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface TimesheetEntry {
  date: string; // YYYY-MM-DD
  hours: number;
  description: string;
  workOrderId: string;
}
```

### Invoice
```typescript
interface Invoice {
  id: string;
  invoiceNumber: string; // e.g., "INV-1730123456"
  vendorId: string;
  companyId: string;
  workOrderId: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';
  totalAmount: number;
  taxAmount: number;
  subtotal: number;
  items: InvoiceItem[];
  dueDate?: string; // YYYY-MM-DD
  paidDate?: string; // YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number; // quantity * unitPrice
}
```

---

## Workflow Examples

### 1. Job Application Flow (Vendor)

```
1. Vendor logs in → Dashboard
2. Navigate to "Jobs" page
3. View list of OPEN jobs (GET /jobs)
4. Click on job to see details
5. Click "Apply" → POST /jobs/{id}/apply
6. Job added to vendor's applicantIds array
7. Company sees application in their jobs list
```

### 2. Work Order Creation & Assignment (Company)

```
1. Company logs in → Dashboard
2. Navigate to "Work Orders" page
3. Click "Create Work Order"
4. Fill form: title, description, due date
5. Submit → POST /work-orders
6. Work order created with status OPEN
7. Click "Assign" on work order
8. Select vendor from dropdown
9. Submit → PUT /work-orders/{id}/assign?vendorId=xxx
10. Status changes to ASSIGNED
11. Vendor sees work order in their list
```

### 3. Timesheet Submission & Approval Flow

```
[Vendor Side]
1. Navigate to "Timesheets"
2. Click "Create Timesheet"
3. Select work order
4. Choose week (start/end dates)
5. Add entries for each day:
   - Date
   - Hours
   - Description
6. Submit → POST /timesheets
7. Timesheet created with status DRAFT
8. Click "Submit" → POST /timesheets/{id}/submit
9. Status changes to SUBMITTED

[Company Side]
1. Navigate to "Timesheets"
2. See SUBMITTED timesheets
3. Click to review
4. Approve → POST /timesheets/{id}/approve
   OR Reject → POST /timesheets/{id}/reject
5. Vendor notified of status
```

### 4. Company Creates Timesheet on Behalf of Vendor

```
1. Company logs in
2. Navigate to "Timesheets"
3. Click "Create Timesheet"
4. Select vendor from dropdown
5. Select work order
6. Fill timesheet entries
7. Include vendorId in POST request:
   POST /timesheets
   {
     "workOrderId": "xxx",
     "vendorId": "vendor-id-here",  // Required for company
     "weekStartDate": "2025-11-01",
     "weekEndDate": "2025-11-07",
     "entries": [...]
   }
```

### 5. Invoice Creation & Payment Flow

```
[Vendor Side]
1. Navigate to "Invoices"
2. Click "Create Invoice"
3. Select work order
4. Add line items:
   - Description
   - Quantity
   - Unit price
5. Set due date (optional)
6. Submit → POST /invoices
7. Invoice created with status DRAFT
8. Click "Submit" → POST /invoices/{id}/submit
9. Status changes to PENDING

[Company Side]
1. Navigate to "Invoices"
2. See PENDING invoices
3. Review invoice details
4. Approve → POST /invoices/{id}/approve
   OR Reject → POST /invoices/{id}/reject
5. If approved, click "Mark as Paid"
6. Submit → POST /invoices/{id}/pay
7. Status changes to PAID
```

---

## Frontend Features by Role

### Vendor Dashboard

**Display Cards:**
- Active Jobs (count)
- Work Orders in Progress (count)
- Total Hours Logged (number)
- Pending Invoices Amount ($)

**Navigation:**
- Dashboard
- Jobs (Browse & Apply)
- Work Orders (View Assigned)
- Timesheets (Create & Submit)
- Invoices (Create & Submit)

**Page: Jobs**
- List of OPEN jobs
- Search/filter functionality
- Job cards showing:
  - Title
  - Company name
  - Location
  - Employment type
  - Salary range
  - "Apply" button (if not already applied)
  - "Applied" badge (if already applied)

**Page: Work Orders**
- List of assigned work orders
- Filter by status
- Work order cards showing:
  - Work order number
  - Title
  - Status badge
  - Due date
  - Action buttons: "View Details", "Update Status"

**Page: Timesheets**
- List of timesheets
- Filter by status (DRAFT, SUBMITTED, APPROVED, REJECTED)
- "Create Timesheet" button
- Timesheet creation form:
  - Work order selector
  - Week date range
  - Entry table with date, hours, description
  - Add/remove rows
  - Notes field
  - "Save Draft" and "Submit" buttons

**Page: Invoices**
- List of invoices
- Filter by status
- "Create Invoice" button
- Invoice creation form:
  - Work order selector
  - Line items table (description, quantity, unit price)
  - Auto-calculate totals
  - Due date picker
  - "Save Draft" and "Submit" buttons

### Company Dashboard

**Display Cards:**
- Active Vendors (count)
- Open Positions (count)
- Work Orders in Progress (count)
- Monthly Spend ($)

**Navigation:**
- Dashboard
- Jobs (Create & Manage)
- Work Orders (Create & Assign)
- Timesheets (Review & Approve)
- Invoices (Review & Pay)

**Page: Jobs**
- List of all company's jobs
- Filter by status
- "Create Job" button
- Job creation form:
  - Title, description, location
  - Employment type selector
  - Skills multi-select
  - Salary range
  - "Save Draft" and "Publish" buttons
- Job cards showing:
  - Applicants count
  - Status controls
  - "View Applicants" button

**Page: Work Orders**
- List of all work orders
- Filter by status
- "Create Work Order" button
- Work order creation form:
  - Title, description
  - Due date
  - Optional: assign vendor immediately
- Work order cards showing:
  - Status badge
  - "Assign Vendor" button (if not assigned)
  - Vendor name (if assigned)
  - Status update controls

**Page: Timesheets**
- List of all timesheets for company's work orders
- Filter by status and vendor
- "Create Timesheet" button (to create on behalf of vendor)
- Timesheet review showing:
  - Vendor name
  - Work order details
  - All entries with dates and hours
  - Total hours
  - "Approve" and "Reject" buttons (if SUBMITTED)

**Page: Invoices**
- List of all invoices
- Filter by status and vendor
- Invoice review showing:
  - Vendor name
  - Work order details
  - All line items
  - Totals breakdown
  - "Approve", "Reject", "Mark as Paid" buttons (based on status)

### Admin Dashboard

**Navigation:**
- Dashboard
- User Management
- All Company features
- All Vendor features (for testing)

**Page: User Management**
- List of all users
- Filter by role (VENDOR, COMPANY, ADMIN)
- Search by name/email
- "Create User" button
- User table showing:
  - Name
  - Email
  - Role badge
  - Active/Inactive status
  - Actions: "Edit", "Delete", "Toggle Status"

**User Creation/Edit Form:**
- Email
- Password (optional for edit)
- Name
- Role selector
- Active toggle

---

## API Integration Tips

### API Client Setup

```typescript
// api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (logout)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### React Query Hooks

```typescript
// hooks/useJobs.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api';

export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data } = await apiClient.get('/jobs');
      return data;
    },
  });
};

export const useApplyForJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (jobId: string) => {
      const { data } = await apiClient.post(`/jobs/${jobId}/apply`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};
```

### Protected Route Component

```typescript
// components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface Props {
  children: React.ReactNode;
  allowedRoles?: ('VENDOR' | 'COMPANY' | 'ADMIN')[];
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user, token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};
```

---

## Error Handling

### Standard Error Response

```typescript
interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
```

### Common HTTP Status Codes

- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)

### Error Handling Example

```typescript
try {
  const response = await apiClient.post('/jobs', jobData);
  toast.success('Job created successfully!');
} catch (error) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'An error occurred';
    
    if (status === 400) {
      toast.error(`Validation error: ${message}`);
    } else if (status === 403) {
      toast.error('You do not have permission to perform this action');
    } else {
      toast.error(message);
    }
  }
}
```

---

## Date Formatting

### Dates in API
- **ISO 8601 with time**: `2025-11-05T10:30:00Z` (createdAt, updatedAt, submittedDate, etc.)
- **Date only**: `2025-11-05` (weekStartDate, weekEndDate, dueDate, paidDate)

### Frontend Display
```typescript
// Format ISO datetime
const formatDateTime = (isoString: string) => {
  return new Date(isoString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format date only
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
```

---

## Status Badge Colors

### Jobs
- `DRAFT` - Gray
- `OPEN` - Green
- `CLOSED` - Red
- `FILLED` - Blue

### Work Orders
- `DRAFT` - Gray
- `OPEN` - Blue
- `ASSIGNED` - Yellow
- `IN_PROGRESS` - Orange
- `COMPLETED` - Green
- `CANCELLED` - Red

### Timesheets
- `DRAFT` - Gray
- `SUBMITTED` - Blue
- `APPROVED` - Green
- `REJECTED` - Red

### Invoices
- `DRAFT` - Gray
- `PENDING` - Blue
- `APPROVED` - Yellow
- `PAID` - Green
- `REJECTED` - Red

---

## Testing Credentials

Create test users via Admin panel or use data initializer:

**Admin:**
- Email: `admin@hourglass.com`
- Password: `admin123`
- Role: ADMIN

**Company:**
- Email: `company@example.com`
- Password: `password123`
- Role: COMPANY

**Vendor:**
- Email: `vendor@example.com`
- Password: `password123`
- Role: VENDOR

---

## Additional Resources

- **API Documentation**: See `API_DOCUMENTATION.md` for detailed endpoint docs
- **OpenAPI Spec**: See `openapi.yml` for complete API specification
- **Swagger UI**: Access at `http://localhost:8082/api/swagger-ui.html`
- **Swagger Guide**: See `SWAGGER_OPENAPI_GUIDE.md` for Swagger/OpenAPI info

---

## Quick Start Checklist

- [ ] Set up authentication (login, token storage)
- [ ] Create protected routes with role checks
- [ ] Implement dashboard for each role
- [ ] Build job listing and application flow
- [ ] Build work order management
- [ ] Build timesheet creation and approval
- [ ] Build invoice creation and payment
- [ ] Add user management (admin only)
- [ ] Implement error handling and loading states
- [ ] Add toast notifications for actions
- [ ] Test all user roles and workflows

---

## Support

For questions or issues:
- Check Swagger UI for live API testing
- Review `API_DOCUMENTATION.md` for endpoint details
- Consult `openapi.yml` for data schemas
- Backend is fully implemented and tested ✅

