# Complete Frontend Development Prompt for Lovable

## Project Overview

You are building a complete, production-ready frontend for **Job Clock Sync** - a vendor and company management platform. The backend API is **98% complete** and fully documented. **All critical endpoints are implemented and ready for use.** Your task is to create a beautiful, modern, and fully functional frontend that integrates seamlessly with the existing backend.

## Repository Access

**GitHub Repository:** https://github.com/iamparamsoni/job-clock-sync

The repository contains:
- ✅ Complete backend API (Spring Boot + MongoDB)
- ✅ Partial frontend implementation (React + TypeScript + Vite)
- ✅ API documentation (`API_DOCUMENTATION.md`)
- ✅ Frontend integration guide (`FRONTEND_INTEGRATION_GUIDE.md`)
- ✅ OpenAPI specification (`openapi.yml`)
- ✅ Existing hooks, components, and pages structure

## Current Frontend Status

### ✅ Already Implemented (75% Complete)
- Authentication flow (login/logout)
- Basic routing structure
- Header and Navigation components
- Protected routes
- Dashboard pages with live stats
- **Company Pages:**
  - ✅ Jobs: Full CRUD (create, edit, view applicants, status update)
  - ✅ Work Orders: Full CRUD (create, assign vendors, status update)
  - ⚠️ Timesheets: Approve/reject working, but missing "Create Timesheet" button
  - ⚠️ Invoices: Approve/reject/pay working, but missing detail view
- **Vendor Pages:**
  - ✅ Jobs: Browse and apply
  - ✅ Work Orders: View and update status
  - ⚠️ Timesheets: List view working, but "New Timesheet" button NOT connected to form
  - ⚠️ Invoices: List view working, but "Create Invoice" button NOT connected to form
- React Query hooks setup
- API client (`src/lib/api.ts`) - All endpoints included
- TypeScript types and interfaces
- UI components (shadcn/ui)
- Form dialogs created:
  - ✅ `JobFormDialog.tsx`
  - ✅ `WorkOrderFormDialog.tsx`
  - ✅ `TimesheetFormDialog.tsx` (exists but not connected)
  - ✅ `InvoiceFormDialog.tsx` (exists but not connected)
  - ✅ `VendorAssignDialog.tsx`
  - ✅ `JobApplicantsDialog.tsx`
- Form validation schemas (Zod)

### ⚠️ Partially Implemented - Needs Completion
- **Forms and modals** - Components exist but need connection:
  - ✅ Jobs: Fully implemented (Company) - Create, edit, view applicants
  - ✅ Work Orders: Fully implemented (Company) - Create, assign, status update
  - ⚠️ **Timesheets: Form component exists but NOT connected to buttons**
    - Vendor page: "New Timesheet" button has no handler
    - Company page: Missing "Create Timesheet" button for creating on behalf of vendors
  - ⚠️ **Invoices: Form component exists but NOT connected to buttons**
    - Vendor page: "Create Invoice" button has no handler
- **Detail view modals** - Missing for:
  - Timesheet details (view entries table)
  - Invoice details (view line items table)
- **Data tables** - Currently using cards, could be enhanced with:
  - Pagination (currently showing all items)
  - Sorting (column headers)
  - Better table layout

## Backend API Information

### Base URL
- **Local Development:** `http://localhost:8082/api`
- **Production:** Configure via environment variables

### Authentication
- JWT Bearer token authentication
- Token stored in localStorage
- All endpoints (except `/auth/login`) require authentication
- Token expires in 24 hours

### User Roles
- **VENDOR**: Can apply for jobs, submit timesheets/invoices, view assigned work orders
- **COMPANY**: Can create jobs/work orders, approve timesheets/invoices, assign work orders

### API Endpoints (39 total - All Critical Endpoints Ready! ✅)

#### Authentication (2)
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user

#### Dashboard (2)
- `GET /dashboard/vendor/stats` - Vendor statistics
- `GET /dashboard/company/stats` - Company statistics

#### Jobs (7)
- `GET /jobs` - Get jobs (role-based)
- `POST /jobs` - Create job (COMPANY only)
- `PUT /jobs/{id}` - Update job (COMPANY only)
- `PUT /jobs/{id}/status` - Update job status (COMPANY only)
- `POST /jobs/{id}/apply` - Apply for job (VENDOR only)
- `GET /jobs/{id}/applicants` - Get job applicants with details (COMPANY only) ✅ **NEW**

#### Work Orders (4)
- `GET /work-orders` - Get work orders (role-based)
- `POST /work-orders` - Create work order (COMPANY only)
- `PUT /work-orders/{id}/status` - Update status
- `PUT /work-orders/{id}/assign` - Assign to vendor (COMPANY only)

#### Timesheets (5)
- `GET /timesheets` - Get timesheets (role-based)
- `POST /timesheets` - Create timesheet (VENDOR or COMPANY*)
- `POST /timesheets/{id}/submit` - Submit for approval (VENDOR only)
- `POST /timesheets/{id}/approve` - Approve (COMPANY only)
- `POST /timesheets/{id}/reject` - Reject (COMPANY only)

*COMPANY can create timesheets on behalf of vendors by including `vendorId` in request

#### Invoices (6)
- `GET /invoices` - Get invoices (role-based)
- `POST /invoices` - Create invoice (VENDOR only)
- `POST /invoices/{id}/submit` - Submit for approval (VENDOR only)
- `POST /invoices/{id}/approve` - Approve (COMPANY only)
- `POST /invoices/{id}/reject` - Reject (COMPANY only)
- `POST /invoices/{id}/pay` - Mark as paid (COMPANY only)

#### Vendors (1) ✅ **NEW**
- `GET /vendors` - Get all active vendors (COMPANY only) - For vendor selection dropdowns

## Complete Feature Requirements

### 1. Vendor Features

#### Dashboard
- Display 4 stat cards:
  - Active Jobs (count)
  - Work Orders in Progress (count)
  - Total Hours Logged (number)
  - Pending Invoices Amount ($)
- Recent activity feed
- Quick actions

#### Jobs Page
- **List view** of all OPEN jobs
- **Search** by title, location, skills
- **Filter** by employment type (FULL_TIME, PART_TIME, CONTRACT)
- **Job cards** showing:
  - Title, company name, location
  - Employment type badge
  - Salary range (if available)
  - Required skills (tags)
  - "Apply" button (if not already applied)
  - "Applied" badge (if already applied)
- **Job detail modal** with full description
- **Apply functionality** with confirmation dialog

#### Work Orders Page
- **List of assigned work orders**
- **Filter** by status (ASSIGNED, IN_PROGRESS, COMPLETED)
- **Work order cards** showing:
  - Work order number
  - Title and description
  - Status badge with color coding
  - Due date
  - Actions: "View Details", "Update Status"
- **Status update modal** (dropdown to change status)
- **Work order detail view** with all information

#### Timesheets Page
- **List of timesheets** with status filter
- **Create Timesheet button** (opens form)
- **Timesheet creation form** with:
  - Work order selector (dropdown)
  - Week start date and end date picker
  - **Dynamic entry table** with:
    - Date picker for each entry
    - Hours input (number)
    - Description textarea
    - Add/remove row buttons
  - Notes field (optional)
  - "Save Draft" and "Submit" buttons
- **Timesheet list** showing:
  - Week range
  - Total hours
  - Status badge
  - Work order number
  - Actions: "View", "Submit" (if DRAFT), "Edit" (if DRAFT)
- **Timesheet detail view** with all entries in table format
- **Submit functionality** with confirmation

#### Invoices Page
- **List of invoices** with status filter
- **Create Invoice button** (opens form)
- **Invoice creation form** with:
  - Work order selector (dropdown)
  - **Dynamic line items table** with:
    - Description input
    - Quantity input (number)
    - Unit price input (number)
    - Auto-calculate total (quantity × unit price)
    - Add/remove row buttons
  - Due date picker (optional)
  - Auto-calculate subtotal, tax (8%), and total
  - "Save Draft" and "Submit" buttons
- **Invoice list** showing:
  - Invoice number
  - Total amount
  - Status badge
  - Due date
  - Actions: "View", "Submit" (if DRAFT), "Edit" (if DRAFT)
- **Invoice detail view** with line items table
- **Submit functionality** with confirmation

### 2. Company Features

#### Dashboard
- Display 4 stat cards:
  - Active Vendors (count)
  - Open Positions (count)
  - Work Orders in Progress (count)
  - Monthly Spend ($)
- Recent activity feed
- Quick actions

#### Jobs Page
- **List of all company's jobs**
- **Filter** by status (DRAFT, OPEN, CLOSED, FILLED)
- **Create Job button** (opens form)
- **Job creation form** with: ✅ **Backend Ready**
  - Title (required)
  - Description (required, textarea)
  - Location (required)
  - Employment type (dropdown: FULL_TIME, PART_TIME, CONTRACT)
  - Required skills (multi-select or tags input)
  - Salary range (min and max, optional)
  - Status selector (DRAFT or OPEN)
  - "Save Draft" and "Publish" buttons
- **Job list** showing:
  - Title and status
  - Location
  - Number of applicants
  - Actions: "Edit", "View Applicants", "Update Status"
- **Job edit form** (same as create) ✅ **Backend Ready - PUT /jobs/{id}**
- **Status update** (dropdown or buttons) ✅ **Backend Ready**
- **Applicants view** (list with vendor details) ✅ **Backend Ready - GET /jobs/{id}/applicants**

#### Work Orders Page
- **List of all work orders**
- **Filter** by status and vendor
- **Create Work Order button** (opens form)
- **Work order creation form** with:
  - Title (required)
  - Description (required, textarea)
  - Due date (date picker, optional)
  - Vendor selector (optional, for immediate assignment)
  - "Create" button
- **Work order list** showing:
  - Work order number
  - Title and status
  - Assigned vendor (if assigned)
  - Due date
  - Actions: "Edit", "Assign Vendor", "Update Status"
- **Assign vendor modal** with vendor dropdown ✅ **Backend Ready - GET /vendors + PUT /work-orders/{id}/assign**
- **Status update** functionality ✅ **Backend Ready**

#### Timesheets Page
- **List of all timesheets** for company's work orders
- **Filter** by status (SUBMITTED, APPROVED, REJECTED) and vendor
- **Create Timesheet button** (for creating on behalf of vendor) ✅ **Backend Ready - POST /timesheets with vendorId**
- **Timesheet creation form** (same as vendor, but with vendor selector) ✅ **Backend Ready - Use GET /vendors for dropdown**
- **Timesheet review view** showing:
  - Vendor name
  - Work order details
  - All entries in table format
  - Total hours
  - Notes
  - Actions: "Approve" (if SUBMITTED), "Reject" (if SUBMITTED)
- **Approve/Reject functionality** with confirmation dialogs ✅ **Backend Ready - POST /timesheets/{id}/approve and /reject**

#### Invoices Page
- **List of all invoices**
- **Filter** by status and vendor
- **Invoice review view** showing:
  - Vendor name
  - Work order details
  - All line items in table
  - Subtotal, tax, total
  - Due date
  - Actions based on status:
    - "Approve" (if PENDING)
    - "Reject" (if PENDING)
    - "Mark as Paid" (if APPROVED)
- **Approve/Reject/Mark as Paid** functionality with confirmations

## Technical Requirements

### Technology Stack
- **React 18+** with TypeScript
- **Vite** for build tooling
- **React Router** for routing (already set up)
- **React Query (TanStack Query)** for data fetching (already set up)
- **Zod** for form validation (already installed)
- **shadcn/ui** components (already set up)
- **Tailwind CSS** for styling
- **date-fns** for date formatting (already installed)
- **Sonner** for toast notifications (already set up)

### Code Quality Standards
1. **TypeScript**: Strict typing, no `any` types
2. **Error Handling**: Comprehensive try-catch blocks, user-friendly error messages
3. **Loading States**: Skeleton loaders for all data fetching
4. **Optimistic Updates**: Update UI immediately, revert on error
5. **Form Validation**: Client-side validation with Zod before API calls
6. **Responsive Design**: Mobile-first, works on all screen sizes
7. **Accessibility**: Proper ARIA labels, keyboard navigation
8. **Code Organization**: 
   - Components in `src/components/`
   - Pages in `src/pages/`
   - Hooks in `src/hooks/`
   - Types in `src/types/`
   - API calls in `src/lib/api.ts`

### UI/UX Guidelines
1. **Consistent Design**: Follow existing design patterns
2. **Color Coding for Status**:
   - DRAFT: Gray
   - OPEN/SUBMITTED/PENDING: Blue
   - IN_PROGRESS/ASSIGNED: Yellow/Orange
   - APPROVED: Green
   - COMPLETED/PAID: Green
   - CLOSED/FILLED: Blue
   - REJECTED/CANCELLED: Red
3. **Empty States**: Show helpful messages when no data
4. **Error States**: Show retry buttons and clear error messages
5. **Confirmation Dialogs**: For destructive actions (delete, reject, etc.)
6. **Success Feedback**: Toast notifications for all successful actions
7. **Form UX**: 
   - Clear labels
   - Helpful placeholder text
   - Inline validation
   - Required field indicators
   - Disable submit button while loading

## Implementation Checklist

### ✅ Completed (75%)
- [x] Jobs: Complete CRUD, applicant management (Company)
- [x] Jobs: Browse and apply (Vendor)
- [x] Work Orders: Complete CRUD, vendor assignment (Company)
- [x] Work Orders: View and status update (Vendor)
- [x] Form components created for all entities
- [x] Form validation schemas (Zod)
- [x] React Query hooks for all operations
- [x] Loading skeletons and empty states
- [x] Toast notifications

### ⚠️ Critical Missing (Must Fix)
- [ ] **Vendor Timesheets:** Connect "New Timesheet" button to `TimesheetFormDialog`
  - Add state and handler in `src/pages/vendor/Timesheets.tsx`
  - Import and render `TimesheetFormDialog`
  - Fetch work orders using `useWorkOrders()` hook
- [ ] **Vendor Invoices:** Connect "Create Invoice" button to `InvoiceFormDialog`
  - Add state and handler in `src/pages/vendor/Invoices.tsx`
  - Import and render `InvoiceFormDialog`
  - Fetch work orders using `useWorkOrders()` hook
- [ ] **Company Timesheets:** Add "Create Timesheet" button
  - Add button in header
  - Connect to `TimesheetFormDialog` with `isCompany={true}`
  - Fetch work orders using `useWorkOrders()` hook

### 📋 Medium Priority (Should Have)
- [ ] **Detail View Modals:**
  - [ ] `TimesheetDetailDialog.tsx` - View timesheet entries in table
  - [ ] `InvoiceDetailDialog.tsx` - View invoice line items and calculations
  - Connect "View" buttons to these dialogs
- [ ] **Work Order Detail View:**
  - [ ] `WorkOrderDetailDialog.tsx` - View full work order details

### 🎨 Low Priority (Nice to Have)
- [ ] Pagination for all list pages
- [ ] Sorting for table columns
- [ ] Convert card layouts to table layouts where appropriate
- [ ] Enhanced filtering options

## API Integration Details

### Request/Response Examples

**Create Job (Company):**
```typescript
POST /api/jobs
{
  "title": "Senior Full Stack Developer",
  "description": "Looking for experienced developer...",
  "location": "New York, NY",
  "employmentType": "FULL_TIME",
  "requiredSkills": ["JavaScript", "React", "Node.js"],
  "salaryMin": 80000,
  "salaryMax": 120000
}
```

**Create Timesheet (Vendor):**
```typescript
POST /api/timesheets
{
  "workOrderId": "507f1f77bcf86cd799439013",
  "weekStartDate": "2025-11-01",
  "weekEndDate": "2025-11-07",
  "entries": [
    {
      "date": "2025-11-01",
      "hours": 8.0,
      "description": "Initial setup and configuration",
      "workOrderId": "507f1f77bcf86cd799439013"
    }
  ],
  "notes": "Completed initial setup"
}
```

**Create Timesheet on Behalf of Vendor (Company):** ✅ **Fully Supported**
```typescript
POST /api/timesheets
{
  "workOrderId": "507f1f77bcf86cd799439013",
  "vendorId": "507f1f77bcf86cd799439012", // Required for company
  "weekStartDate": "2025-11-01",
  "weekEndDate": "2025-11-07",
  "entries": [...]
}
```

**Get Vendors List (Company):** ✅ **NEW - Use for vendor selection**
```typescript
GET /api/vendors
// Returns: Array of UserResponse with vendor details
// Use this to populate vendor dropdowns
```

**Get Job Applicants (Company):** ✅ **NEW - Use for applicant management**
```typescript
GET /api/jobs/{id}/applicants
// Returns: Array of UserResponse with applicant details (name, email, etc.)
```

**Create Invoice (Vendor):**
```typescript
POST /api/invoices
{
  "workOrderId": "507f1f77bcf86cd799439013",
  "items": [
    {
      "description": "Website development services",
      "quantity": 40,
      "unitPrice": 125.00
    }
  ],
  "dueDate": "2025-12-31"
}
```

## Important Notes

1. **Profile Display**: User profile shows "Vendor" or "Company" (not names) - this is intentional
2. **Date Format**: Use YYYY-MM-DD format for dates in API requests
3. **Status Workflows**: Respect the status transitions (e.g., can't approve DRAFT timesheet)
4. **Role-Based Access**: Hide/show UI elements based on user role
5. **Error Messages**: Show backend error messages to users when available
6. **Token Management**: API client already handles token storage and headers
7. **CORS**: Already configured for localhost and Lovable preview domains

## ✅ Backend Readiness Status

**Backend is 98% READY** - All critical endpoints are implemented!

### ✅ Fully Supported Features:
- ✅ All CREATE operations (Jobs, Work Orders, Timesheets, Invoices)
- ✅ All READ operations (with role-based filtering)
- ✅ All status workflows (approve, reject, submit, mark as paid)
- ✅ **Company creating timesheets for vendors** (fully implemented)
- ✅ **Vendor list endpoint** (`GET /vendors`) - For company dropdowns
- ✅ **Job applicants details** (`GET /jobs/{id}/applicants`) - For applicant management
- ✅ Job update (`PUT /jobs/{id}`)
- ✅ Vendor assignment to work orders
- ✅ All dashboard statistics

### ⚠️ Optional Features (Workarounds Available):
- ⚠️ **DELETE endpoints**: Not implemented (use soft delete via status change)
- ⚠️ **Update work order details**: Only status update available (create new if needed)
- ⚠️ **Update timesheet/invoice**: Cannot edit after creation (create new if needed)

**Note:** The missing endpoints are optional and won't block frontend development. All critical features are fully supported!

## Testing Credentials

Use these credentials to test (create users via backend or seed data):
- **Company:** `company@example.com` / `password123`
- **Vendor:** `vendor@example.com` / `password123`

## Deliverables

1. **Complete all CRUD operations** for all entities
2. **Beautiful, modern UI** with consistent design
3. **Fully responsive** layout
4. **Comprehensive error handling**
5. **Loading states** throughout
6. **Form validation** with helpful error messages
7. **Optimistic updates** for better UX
8. **Toast notifications** for all actions
9. **Empty states** and error states
10. **Production-ready code** with TypeScript strict mode

## Reference Files

- `API_DOCUMENTATION.md` - Complete API reference (39 endpoints documented)
- `BACKEND_READINESS_REPORT.md` - Detailed backend readiness analysis
- `FRONTEND_INTEGRATION_GUIDE.md` - Detailed integration guide
- `openapi.yml` - OpenAPI 3.0 specification (39 endpoints)
- `src/lib/api.ts` - API client implementation (all endpoints included)
- `src/types/` - TypeScript type definitions
- `src/hooks/` - React Query hooks

## Questions?

Refer to:
1. Backend API documentation in `API_DOCUMENTATION.md`
2. Frontend integration guide in `FRONTEND_INTEGRATION_GUIDE.md`
3. OpenAPI spec in `openapi.yml` for complete request/response schemas
4. Existing code patterns in `src/pages/` and `src/components/`

## Success Criteria

The frontend is complete when:
- ✅ All pages have full CRUD functionality
- ✅ All forms work with proper validation
- ✅ All status workflows are implemented
- ✅ Error handling is comprehensive
- ✅ UI is beautiful and responsive
- ✅ Code is production-ready with TypeScript
- ✅ No console errors
- ✅ All features work end-to-end

## 🔧 Critical Fixes Needed

### 1. Connect Vendor Timesheet Form (HIGH PRIORITY)

**File:** `src/pages/vendor/Timesheets.tsx`

**Add:**
```typescript
import { TimesheetFormDialog } from "@/components/timesheets/TimesheetFormDialog";
import { useWorkOrders } from "@/hooks/useWorkOrders";

const [timesheetFormOpen, setTimesheetFormOpen] = useState(false);
const { data: workOrders = [] } = useWorkOrders();

const handleCreateTimesheet = () => {
  setTimesheetFormOpen(true);
};

// Update button onClick
<Button onClick={handleCreateTimesheet}>

// Add dialog at end
<TimesheetFormDialog
  open={timesheetFormOpen}
  onOpenChange={setTimesheetFormOpen}
  workOrders={workOrders}
  isCompany={false}
/>
```

### 2. Connect Vendor Invoice Form (HIGH PRIORITY)

**File:** `src/pages/vendor/Invoices.tsx`

**Add:**
```typescript
import { InvoiceFormDialog } from "@/components/invoices/InvoiceFormDialog";
import { useWorkOrders } from "@/hooks/useWorkOrders";

const [invoiceFormOpen, setInvoiceFormOpen] = useState(false);
const { data: workOrders = [] } = useWorkOrders();

const handleCreateInvoice = () => {
  setInvoiceFormOpen(true);
};

// Update button onClick
<Button onClick={handleCreateInvoice}>

// Add dialog at end
<InvoiceFormDialog
  open={invoiceFormOpen}
  onOpenChange={setInvoiceFormOpen}
  workOrders={workOrders}
/>
```

### 3. Add Company Create Timesheet Feature (MEDIUM PRIORITY)

**File:** `src/pages/company/Timesheets.tsx`

**Add:**
```typescript
import { TimesheetFormDialog } from "@/components/timesheets/TimesheetFormDialog";
import { useWorkOrders } from "@/hooks/useWorkOrders";

const [timesheetFormOpen, setTimesheetFormOpen] = useState(false);
const { data: workOrders = [] } = useWorkOrders();

const handleCreateTimesheet = () => {
  setTimesheetFormOpen(true);
};

// Add button in header section
<div className="flex justify-between items-center mb-6">
  <div>
    <h1 className="text-3xl font-bold">Timesheets</h1>
    <p className="text-muted-foreground">Review and approve vendor timesheets</p>
  </div>
  <Button onClick={handleCreateTimesheet}>
    <Plus className="mr-2 h-4 w-4" />
    Create Timesheet
  </Button>
</div>

// Add dialog at end
<TimesheetFormDialog
  open={timesheetFormOpen}
  onOpenChange={setTimesheetFormOpen}
  workOrders={workOrders}
  isCompany={true}
/>
```

---

## 📊 Current Status Summary

**Completion:** ~75%

**What's Working:**
- ✅ Company: Jobs (full CRUD), Work Orders (full CRUD)
- ✅ Vendor: Jobs (browse/apply), Work Orders (view/update)
- ✅ All form dialogs created and validated
- ✅ All hooks implemented
- ✅ Approve/reject workflows working

**What's Missing:**
- ❌ Vendor Timesheet form connection (CRITICAL)
- ❌ Vendor Invoice form connection (CRITICAL)
- ❌ Company create timesheet button (MEDIUM)
- ❌ Detail view modals (MEDIUM)
- ⚠️ Pagination and sorting (LOW)

**Estimated Time to Complete:** 5-7 hours

---

**Priority Actions:**
1. Connect existing form dialogs to buttons (2-3 hours)
2. Add company create timesheet feature (1 hour)
3. Create detail view modals (2-3 hours)

**All form components are ready - just need to connect them!** 🚀

