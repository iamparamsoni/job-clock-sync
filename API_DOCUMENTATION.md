# Job Clock Sync - API Documentation

## Base URL

- **Development**: `http://localhost:8082/api`
- **Production**: `https://your-domain.com/api`

## Authentication

All endpoints except `/auth/login` require JWT authentication.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

## User Roles

- **VENDOR**: Service providers who can apply for jobs, submit timesheets and invoices
- **COMPANY**: Organizations who can post jobs, create work orders, and approve submissions
- **ADMIN**: Administrators who can manage users, roles, and permissions

## API Sections

1. [Authentication APIs](#1-authentication-apis) - Login and user management
2. [User Management APIs](#2-user-management-apis) - Admin user CRUD operations (NEW)
3. [Dashboard APIs](#3-dashboard-apis) - Statistics for vendors and companies
4. [Work Order APIs](#4-work-order-apis) - Work order management
5. [Job APIs](#5-job-apis) - Job posting and applications
6. [Timesheet APIs](#6-timesheet-apis) - Timesheet creation and approval
7. [Invoice APIs](#7-invoice-apis) - Invoice management and payment
8. [Database Schemas](#database-schemas) - MongoDB collections

---

## 1. Authentication APIs

### 1.1 Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and get JWT token

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "string (required, email format)",
  "password": "string (required)"
}
```

**Response:** `200 OK`
```json
{
  "token": "string (JWT token)",
  "id": "string (user ID)",
  "email": "string",
  "name": "string",
  "role": "string (VENDOR | COMPANY)"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid credentials or validation error

**Example:**
```bash
curl -X POST http://localhost:8082/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "company@example.com",
    "password": "password123"
  }'
```

---

### 1.2 Get Current User

**Endpoint:** `GET /auth/me`

**Description:** Get current authenticated user details

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "string (VENDOR | COMPANY)",
  "active": "boolean",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Example:**
```bash
curl -X GET http://localhost:8082/api/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 2. User Management APIs

### 2.1 Get All Users

**Endpoint:** `GET /users`

**Description:** Get all users in the system (Admin only)

**Authentication:** Required (ADMIN role only)

**Response:** `200 OK`
```json
[
  {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string (VENDOR | COMPANY | ADMIN)",
    "active": "boolean",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
]
```

**Error Responses:**
- `403 Forbidden`: User is not an admin

---

### 2.2 Get User by ID

**Endpoint:** `GET /users/{id}`

**Description:** Get user details by ID (Admin only)

**Authentication:** Required (ADMIN role only)

**Path Parameters:**
- `id` (required): User ID

**Response:** `200 OK`
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "string",
  "active": "boolean",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Error Responses:**
- `403 Forbidden`: User is not an admin
- `404 Not Found`: User not found

---

### 2.3 Get Users by Role

**Endpoint:** `GET /users/role/{role}`

**Description:** Get all users with a specific role (Admin only)

**Authentication:** Required (ADMIN role only)

**Path Parameters:**
- `role` (required): User role (VENDOR | COMPANY | ADMIN)

**Response:** `200 OK`
```json
[
  {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string",
    "active": "boolean",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
]
```

**Error Responses:**
- `400 Bad Request`: Invalid role
- `403 Forbidden`: User is not an admin

---

### 2.4 Create User

**Endpoint:** `POST /users`

**Description:** Create a new user (Admin only)

**Authentication:** Required (ADMIN role only)

**Request Body:**
```json
{
  "email": "string (required, email format)",
  "password": "string (required, min 6 characters)",
  "name": "string (required)",
  "role": "string (required, VENDOR | COMPANY | ADMIN)",
  "active": "boolean (optional, default: true)"
}
```

**Response:** `200 OK`
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "string",
  "active": "boolean",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Error Responses:**
- `400 Bad Request`: User already exists or validation error
- `403 Forbidden`: User is not an admin

**Example:**
```bash
curl -X POST http://localhost:8082/api/users \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securePassword123",
    "name": "New User",
    "role": "VENDOR",
    "active": true
  }'
```

---

### 2.5 Update User

**Endpoint:** `PUT /users/{id}`

**Description:** Update user details (Admin only)

**Authentication:** Required (ADMIN role only)

**Path Parameters:**
- `id` (required): User ID

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (optional, only if changing password)",
  "name": "string (required)",
  "role": "string (required)",
  "active": "boolean (optional)"
}
```

**Response:** `200 OK`
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "string",
  "active": "boolean",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Error Responses:**
- `403 Forbidden`: User is not an admin
- `404 Not Found`: User not found

---

### 2.6 Delete User

**Endpoint:** `DELETE /users/{id}`

**Description:** Delete a user (Admin only)

**Authentication:** Required (ADMIN role only)

**Path Parameters:**
- `id` (required): User ID

**Response:** `204 No Content`

**Error Responses:**
- `403 Forbidden`: User is not an admin
- `404 Not Found`: User not found

---

### 2.7 Toggle User Status

**Endpoint:** `POST /users/{id}/toggle-status`

**Description:** Enable or disable a user account (Admin only)

**Authentication:** Required (ADMIN role only)

**Path Parameters:**
- `id` (required): User ID

**Response:** `200 OK`
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "string",
  "active": "boolean",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Error Responses:**
- `403 Forbidden`: User is not an admin
- `404 Not Found`: User not found

---

## 3. Dashboard APIs

### 3.1 Get Vendor Dashboard Stats

**Endpoint:** `GET /dashboard/vendor/stats`

**Description:** Get dashboard statistics for vendor

**Authentication:** Required (VENDOR role only)

**Response:** `200 OK`
```json
{
  "activeJobs": "integer",
  "workOrdersInProgress": "integer",
  "totalHours": "number",
  "pendingInvoicesAmount": "number",
  "activeVendors": null,
  "openPositions": null,
  "workOrdersInProgressCompany": null,
  "monthlySpend": null
}
```

**Error Responses:**
- `403 Forbidden`: User is not a vendor

---

### 3.2 Get Company Dashboard Stats

**Endpoint:** `GET /dashboard/company/stats`

**Description:** Get dashboard statistics for company

**Authentication:** Required (COMPANY role only)

**Response:** `200 OK`
```json
{
  "activeJobs": null,
  "workOrdersInProgress": null,
  "totalHours": null,
  "pendingInvoicesAmount": null,
  "activeVendors": "integer",
  "openPositions": "integer",
  "workOrdersInProgressCompany": "integer",
  "monthlySpend": "number"
}
```

**Error Responses:**
- `403 Forbidden`: User is not a company

---

## 4. Work Order APIs

### 4.1 Create Work Order

**Endpoint:** `POST /work-orders`

**Description:** Create a new work order

**Authentication:** Required (COMPANY role only)

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "dueDate": "string (ISO 8601, optional)",
  "vendorId": "string (optional)"
}
```

**Response:** `200 OK`
```json
{
  "id": "string",
  "workOrderNumber": "string (e.g., WO-1730123456)",
  "title": "string",
  "description": "string",
  "companyId": "string",
  "vendorId": "string | null",
  "status": "string (DRAFT | OPEN | ASSIGNED | IN_PROGRESS | COMPLETED | CANCELLED)",
  "assignedDate": "string (ISO 8601) | null",
  "dueDate": "string (ISO 8601) | null",
  "completedDate": "string (ISO 8601) | null",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Error Responses:**
- `403 Forbidden`: User is not a company

---

### 4.2 Get Work Orders

**Endpoint:** `GET /work-orders`

**Description:** Get work orders based on user role
- VENDOR: Returns work orders assigned to vendor
- COMPANY: Returns work orders created by company

**Authentication:** Required

**Response:** `200 OK`
```json
[
  {
    "id": "string",
    "workOrderNumber": "string",
    "title": "string",
    "description": "string",
    "companyId": "string",
    "vendorId": "string | null",
    "status": "string",
    "assignedDate": "string (ISO 8601) | null",
    "dueDate": "string (ISO 8601) | null",
    "completedDate": "string (ISO 8601) | null",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
]
```

---

### 4.3 Update Work Order Status

**Endpoint:** `PUT /work-orders/{id}/status`

**Description:** Update work order status

**Authentication:** Required

**Query Parameters:**
- `status` (required): DRAFT | OPEN | ASSIGNED | IN_PROGRESS | COMPLETED | CANCELLED

**Response:** `200 OK`
```json
{
  "id": "string",
  "workOrderNumber": "string",
  "title": "string",
  "description": "string",
  "companyId": "string",
  "vendorId": "string | null",
  "status": "string",
  "assignedDate": "string (ISO 8601) | null",
  "dueDate": "string (ISO 8601) | null",
  "completedDate": "string (ISO 8601) | null",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid status value
- `404 Not Found`: Work order not found

**Example:**
```bash
curl -X PUT "http://localhost:8082/api/work-orders/123/status?status=IN_PROGRESS" \
  -H "Authorization: Bearer <TOKEN>"
```

---

### 4.4 Assign Work Order

**Endpoint:** `PUT /work-orders/{id}/assign`

**Description:** Assign work order to a vendor

**Authentication:** Required (COMPANY role only)

**Query Parameters:**
- `vendorId` (required): ID of vendor to assign

**Response:** `200 OK`
```json
{
  "id": "string",
  "workOrderNumber": "string",
  "title": "string",
  "description": "string",
  "companyId": "string",
  "vendorId": "string",
  "status": "ASSIGNED",
  "assignedDate": "string (ISO 8601)",
  "dueDate": "string (ISO 8601) | null",
  "completedDate": "string (ISO 8601) | null",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Error Responses:**
- `403 Forbidden`: User is not a company
- `404 Not Found`: Work order not found

**Example:**
```bash
curl -X PUT "http://localhost:8082/api/work-orders/123/assign?vendorId=456" \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 5. Job APIs

### 5.1 Create Job

**Endpoint:** `POST /jobs`

**Description:** Create a new job posting

**Authentication:** Required (COMPANY role only)

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "location": "string (required)",
  "employmentType": "string (required, e.g., FULL_TIME, PART_TIME, CONTRACT)",
  "requiredSkills": ["string"] (optional),
  "salaryMin": "number (optional)",
  "salaryMax": "number (optional)"
}
```

**Response:** `200 OK`
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "companyId": "string",
  "status": "string (DRAFT | OPEN | CLOSED | FILLED)",
  "requiredSkills": ["string"],
  "location": "string",
  "salaryMin": "number",
  "salaryMax": "number",
  "employmentType": "string",
  "applicantIds": ["string"],
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Error Responses:**
- `403 Forbidden`: User is not a company

---

### 5.2 Get Jobs

**Endpoint:** `GET /jobs`

**Description:** Get jobs based on user role
- VENDOR: Returns open jobs
- COMPANY: Returns jobs created by company

**Authentication:** Required

**Response:** `200 OK`
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "companyId": "string",
    "status": "string",
    "requiredSkills": ["string"],
    "location": "string",
    "salaryMin": "number",
    "salaryMax": "number",
    "employmentType": "string",
    "applicantIds": ["string"],
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
]
```

---

### 5.3 Update Job Status

**Endpoint:** `PUT /jobs/{id}/status`

**Description:** Update job status

**Authentication:** Required (COMPANY role only)

**Query Parameters:**
- `status` (required): DRAFT | OPEN | CLOSED | FILLED

**Response:** `200 OK`
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "companyId": "string",
  "status": "string",
  "requiredSkills": ["string"],
  "location": "string",
  "salaryMin": "number",
  "salaryMax": "number",
  "employmentType": "string",
  "applicantIds": ["string"],
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Error Responses:**
- `403 Forbidden`: User is not a company
- `400 Bad Request`: Invalid status value
- `404 Not Found`: Job not found

---

### 5.4 Apply for Job

**Endpoint:** `POST /jobs/{id}/apply`

**Description:** Vendor applies for a job

**Authentication:** Required (VENDOR role only)

**Response:** `200 OK`
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "companyId": "string",
  "status": "string",
  "requiredSkills": ["string"],
  "location": "string",
  "salaryMin": "number",
  "salaryMax": "number",
  "employmentType": "string",
  "applicantIds": ["string"],
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Error Responses:**
- `403 Forbidden`: User is not a vendor
- `404 Not Found`: Job not found

---

### 5.5 Update Job

**Endpoint:** `PUT /jobs/{id}`

**Description:** Update job details

**Authentication:** Required (COMPANY role only)

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "location": "string (required)",
  "employmentType": "string (required)",
  "requiredSkills": ["string"] (optional),
  "salaryMin": "number (optional)",
  "salaryMax": "number (optional)"
}
```

**Response:** `200 OK`
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "companyId": "string",
  "status": "string",
  "requiredSkills": ["string"],
  "location": "string",
  "salaryMin": "number",
  "salaryMax": "number",
  "employmentType": "string",
  "applicantIds": ["string"],
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Error Responses:**
- `403 Forbidden`: User is not a company
- `404 Not Found`: Job not found

---

## 6. Timesheet APIs

### 6.1 Create Timesheet

**Endpoint:** `POST /timesheets`

**Description:** Create a new timesheet. VENDOR creates for themselves, COMPANY can create on behalf of vendor.

**Authentication:** Required (VENDOR or COMPANY role)

**Request Body:**
```json
{
  "workOrderId": "string (required)",
  "weekStartDate": "string (required, YYYY-MM-DD format)",
  "weekEndDate": "string (required, YYYY-MM-DD format)",
  "entries": [
    {
      "date": "string (required, YYYY-MM-DD format)",
      "hours": "number (required)",
      "description": "string (required)",
      "workOrderId": "string (required)"
    }
  ],
  "notes": "string (optional)",
  "vendorId": "string (optional, required for COMPANY creating on behalf of vendor)"
}
```

**Response:** `200 OK`
```json
{
  "id": "string",
  "vendorId": "string",
  "companyId": "string",
  "workOrderId": "string",
  "status": "string (DRAFT | SUBMITTED | APPROVED | REJECTED)",
  "weekStartDate": "string (YYYY-MM-DD)",
  "weekEndDate": "string (YYYY-MM-DD)",
  "entries": [
    {
      "date": "string (YYYY-MM-DD)",
      "hours": "number",
      "description": "string",
      "workOrderId": "string"
    }
  ],
  "totalHours": "number",
  "notes": "string",
  "submittedDate": "string (ISO 8601) | null",
  "approvedDate": "string (ISO 8601) | null",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Error Responses:**
- `400 Bad Request`: Missing vendorId when COMPANY creates timesheet
- `403 Forbidden`: User is not a vendor or company

---

### 6.2 Get Timesheets

**Endpoint:** `GET /timesheets`

**Description:** Get timesheets based on user role
- VENDOR: Returns timesheets created by vendor
- COMPANY: Returns timesheets for company's work orders

**Authentication:** Required

**Response:** `200 OK`
```json
[
  {
    "id": "string",
    "vendorId": "string",
    "companyId": "string",
    "workOrderId": "string",
    "status": "string",
    "weekStartDate": "string (YYYY-MM-DD)",
    "weekEndDate": "string (YYYY-MM-DD)",
    "entries": [
      {
        "date": "string (YYYY-MM-DD)",
        "hours": "number",
        "description": "string",
        "workOrderId": "string"
      }
    ],
    "totalHours": "number",
    "notes": "string",
    "submittedDate": "string (ISO 8601) | null",
    "approvedDate": "string (ISO 8601) | null",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
]
```

---

### 6.3 Submit Timesheet

**Endpoint:** `POST /timesheets/{id}/submit`

**Description:** Submit timesheet for approval

**Authentication:** Required (VENDOR role only)

**Response:** `200 OK`
```json
{
  "id": "string",
  "vendorId": "string",
  "companyId": "string",
  "workOrderId": "string",
  "status": "SUBMITTED",
  "weekStartDate": "string (YYYY-MM-DD)",
  "weekEndDate": "string (YYYY-MM-DD)",
  "entries": [...],
  "totalHours": "number",
  "notes": "string",
  "submittedDate": "string (ISO 8601)",
  "approvedDate": "string (ISO 8601) | null",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Error Responses:**
- `403 Forbidden`: User is not a vendor
- `404 Not Found`: Timesheet not found

---

### 6.4 Approve Timesheet

**Endpoint:** `POST /timesheets/{id}/approve`

**Description:** Approve a submitted timesheet

**Authentication:** Required (COMPANY role only)

**Response:** `200 OK`
```json
{
  "id": "string",
  "vendorId": "string",
  "companyId": "string",
  "workOrderId": "string",
  "status": "APPROVED",
  "weekStartDate": "string (YYYY-MM-DD)",
  "weekEndDate": "string (YYYY-MM-DD)",
  "entries": [...],
  "totalHours": "number",
  "notes": "string",
  "submittedDate": "string (ISO 8601)",
  "approvedDate": "string (ISO 8601)",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Error Responses:**
- `403 Forbidden`: User is not a company
- `404 Not Found`: Timesheet not found

---

### 6.5 Reject Timesheet

**Endpoint:** `POST /timesheets/{id}/reject`

**Description:** Reject a submitted timesheet

**Authentication:** Required (COMPANY role only)

**Response:** `200 OK`
```json
{
  "id": "string",
  "vendorId": "string",
  "companyId": "string",
  "workOrderId": "string",
  "status": "REJECTED",
  "weekStartDate": "string (YYYY-MM-DD)",
  "weekEndDate": "string (YYYY-MM-DD)",
  "entries": [...],
  "totalHours": "number",
  "notes": "string",
  "submittedDate": "string (ISO 8601)",
  "approvedDate": "string (ISO 8601) | null",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Error Responses:**
- `403 Forbidden`: User is not a company
- `404 Not Found`: Timesheet not found

---

## 7. Invoice APIs

### 7.1 Create Invoice

**Endpoint:** `POST /invoices`

**Description:** Create a new invoice

**Authentication:** Required (VENDOR role only)

**Request Body:**
```json
{
  "workOrderId": "string (required)",
  "items": [
    {
      "description": "string (required)",
      "quantity": "integer (required)",
      "unitPrice": "number (required)"
    }
  ],
  "dueDate": "string (optional, YYYY-MM-DD format)"
}
```

**Response:** `200 OK`
```json
{
  "id": "string",
  "invoiceNumber": "string (e.g., INV-1730123456)",
  "vendorId": "string",
  "companyId": "string",
  "workOrderId": "string",
  "status": "string (DRAFT | PENDING | APPROVED | PAID | REJECTED)",
  "totalAmount": "number",
  "taxAmount": "number",
  "subtotal": "number",
  "items": [
    {
      "description": "string",
      "quantity": "integer",
      "unitPrice": "number",
      "total": "number"
    }
  ],
  "dueDate": "string (YYYY-MM-DD) | null",
  "paidDate": "string (YYYY-MM-DD) | null",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Error Responses:**
- `403 Forbidden`: User is not a vendor

---

### 7.2 Get Invoices

**Endpoint:** `GET /invoices`

**Description:** Get invoices based on user role
- VENDOR: Returns invoices created by vendor
- COMPANY: Returns invoices for company

**Authentication:** Required

**Response:** `200 OK`
```json
[
  {
    "id": "string",
    "invoiceNumber": "string",
    "vendorId": "string",
    "companyId": "string",
    "workOrderId": "string",
    "status": "string",
    "totalAmount": "number",
    "taxAmount": "number",
    "subtotal": "number",
    "items": [
      {
        "description": "string",
        "quantity": "integer",
        "unitPrice": "number",
        "total": "number"
      }
    ],
    "dueDate": "string (YYYY-MM-DD) | null",
    "paidDate": "string (YYYY-MM-DD) | null",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
]
```

---

### 7.3 Submit Invoice

**Endpoint:** `POST /invoices/{id}/submit`

**Description:** Submit invoice for approval

**Authentication:** Required (VENDOR role only)

**Response:** `200 OK`
```json
{
  "id": "string",
  "invoiceNumber": "string",
  "vendorId": "string",
  "companyId": "string",
  "workOrderId": "string",
  "status": "PENDING",
  "totalAmount": "number",
  "taxAmount": "number",
  "subtotal": "number",
  "items": [...],
  "dueDate": "string (YYYY-MM-DD) | null",
  "paidDate": "string (YYYY-MM-DD) | null",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Error Responses:**
- `403 Forbidden`: User is not a vendor
- `404 Not Found`: Invoice not found

---

### 7.4 Approve Invoice

**Endpoint:** `POST /invoices/{id}/approve`

**Description:** Approve a submitted invoice

**Authentication:** Required (COMPANY role only)

**Response:** `200 OK`
```json
{
  "id": "string",
  "invoiceNumber": "string",
  "vendorId": "string",
  "companyId": "string",
  "workOrderId": "string",
  "status": "APPROVED",
  "totalAmount": "number",
  "taxAmount": "number",
  "subtotal": "number",
  "items": [...],
  "dueDate": "string (YYYY-MM-DD) | null",
  "paidDate": "string (YYYY-MM-DD) | null",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Error Responses:**
- `403 Forbidden`: User is not a company
- `404 Not Found`: Invoice not found

---

### 7.5 Reject Invoice

**Endpoint:** `POST /invoices/{id}/reject`

**Description:** Reject a submitted invoice

**Authentication:** Required (COMPANY role only)

**Response:** `200 OK`
```json
{
  "id": "string",
  "invoiceNumber": "string",
  "vendorId": "string",
  "companyId": "string",
  "workOrderId": "string",
  "status": "REJECTED",
  "totalAmount": "number",
  "taxAmount": "number",
  "subtotal": "number",
  "items": [...],
  "dueDate": "string (YYYY-MM-DD) | null",
  "paidDate": "string (YYYY-MM-DD) | null",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Error Responses:**
- `403 Forbidden`: User is not a company
- `404 Not Found`: Invoice not found

---

### 7.6 Mark Invoice as Paid

**Endpoint:** `POST /invoices/{id}/pay`

**Description:** Mark an approved invoice as paid

**Authentication:** Required (COMPANY role only)

**Response:** `200 OK`
```json
{
  "id": "string",
  "invoiceNumber": "string",
  "vendorId": "string",
  "companyId": "string",
  "workOrderId": "string",
  "status": "PAID",
  "totalAmount": "number",
  "taxAmount": "number",
  "subtotal": "number",
  "items": [...],
  "dueDate": "string (YYYY-MM-DD) | null",
  "paidDate": "string (YYYY-MM-DD)",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Error Responses:**
- `403 Forbidden`: User is not a company
- `404 Not Found`: Invoice not found

---

## Database Schemas

### User Collection

**Collection Name:** `users`

```json
{
  "_id": "ObjectId",
  "email": "string (unique, indexed)",
  "password": "string (hashed with BCrypt)",
  "name": "string",
  "role": "string (VENDOR | COMPANY)",
  "active": "boolean (default: true)",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

**Indexes:**
- `email` (unique)

---

### Work Order Collection

**Collection Name:** `workorders`

```json
{
  "_id": "ObjectId",
  "workOrderNumber": "string (unique, indexed, format: WO-{timestamp})",
  "title": "string",
  "description": "string",
  "companyId": "string (reference to User)",
  "vendorId": "string (reference to User, nullable)",
  "status": "string (DRAFT | OPEN | ASSIGNED | IN_PROGRESS | COMPLETED | CANCELLED)",
  "assignedDate": "DateTime (nullable)",
  "dueDate": "DateTime (nullable)",
  "completedDate": "DateTime (nullable)",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

**Indexes:**
- `workOrderNumber` (unique)

---

### Job Collection

**Collection Name:** `jobs`

```json
{
  "_id": "ObjectId",
  "title": "string",
  "description": "string",
  "companyId": "string (reference to User)",
  "status": "string (DRAFT | OPEN | CLOSED | FILLED)",
  "requiredSkills": ["string"],
  "location": "string",
  "salaryMin": "number (nullable)",
  "salaryMax": "number (nullable)",
  "employmentType": "string (FULL_TIME | PART_TIME | CONTRACT)",
  "applicantIds": ["string"] (references to User)",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

---

### Timesheet Collection

**Collection Name:** `timesheets`

```json
{
  "_id": "ObjectId",
  "vendorId": "string (reference to User)",
  "companyId": "string (reference to User)",
  "workOrderId": "string (reference to WorkOrder)",
  "status": "string (DRAFT | SUBMITTED | APPROVED | REJECTED)",
  "weekStartDate": "Date (YYYY-MM-DD)",
  "weekEndDate": "Date (YYYY-MM-DD)",
  "entries": [
    {
      "date": "Date (YYYY-MM-DD)",
      "hours": "number",
      "description": "string",
      "workOrderId": "string"
    }
  ],
  "totalHours": "number",
  "notes": "string (nullable)",
  "submittedDate": "DateTime (nullable)",
  "approvedDate": "DateTime (nullable)",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

---

### Invoice Collection

**Collection Name:** `invoices`

```json
{
  "_id": "ObjectId",
  "invoiceNumber": "string (unique, indexed, format: INV-{timestamp})",
  "vendorId": "string (reference to User)",
  "companyId": "string (reference to User)",
  "workOrderId": "string (reference to WorkOrder)",
  "status": "string (DRAFT | PENDING | APPROVED | PAID | REJECTED)",
  "totalAmount": "number",
  "taxAmount": "number",
  "subtotal": "number",
  "items": [
    {
      "description": "string",
      "quantity": "integer",
      "unitPrice": "number",
      "total": "number"
    }
  ],
  "dueDate": "Date (YYYY-MM-DD, nullable)",
  "paidDate": "Date (YYYY-MM-DD, nullable)",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

**Indexes:**
- `invoiceNumber` (unique)

---

## Common Error Responses

### 400 Bad Request
```json
{
  "timestamp": "string (ISO 8601)",
  "status": 400,
  "error": "Bad Request",
  "message": "string (error description)",
  "path": "string (request path)"
}
```

### 401 Unauthorized
```json
{
  "timestamp": "string (ISO 8601)",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "path": "string (request path)"
}
```

### 403 Forbidden
```json
{
  "timestamp": "string (ISO 8601)",
  "status": 403,
  "error": "Forbidden",
  "message": "Access denied",
  "path": "string (request path)"
}
```

### 404 Not Found
```json
{
  "timestamp": "string (ISO 8601)",
  "status": 404,
  "error": "Not Found",
  "message": "Resource not found",
  "path": "string (request path)"
}
```

---

## Data Flow Examples

### 1. Company Creates Work Order and Assigns to Vendor

```
1. POST /work-orders
   → Creates work order with status DRAFT/OPEN

2. PUT /work-orders/{id}/assign?vendorId=...
   → Assigns to vendor, status becomes ASSIGNED

3. PUT /work-orders/{id}/status?status=IN_PROGRESS
   → Vendor marks as in progress

4. PUT /work-orders/{id}/status?status=COMPLETED
   → Vendor marks as completed
```

### 2. Vendor Submits Timesheet

```
1. POST /timesheets
   → Creates timesheet with status DRAFT

2. POST /timesheets/{id}/submit
   → Submits for approval, status becomes SUBMITTED

3. POST /timesheets/{id}/approve
   → Company approves, status becomes APPROVED
```

### 3. Vendor Creates and Submits Invoice

```
1. POST /invoices
   → Creates invoice with status DRAFT

2. POST /invoices/{id}/submit
   → Submits for approval, status becomes PENDING

3. POST /invoices/{id}/approve
   → Company approves, status becomes APPROVED

4. POST /invoices/{id}/pay
   → Company marks as paid, status becomes PAID
```

---

## Notes

1. All timestamps are in ISO 8601 format (e.g., `2025-11-05T10:30:00Z`)
2. Date fields (weekStartDate, weekEndDate, dueDate, paidDate) are in YYYY-MM-DD format
3. JWT tokens expire after 24 hours (configurable in application.properties)
4. Password requirements: Minimum 6 characters (configurable)
5. All monetary amounts are in USD (or configured currency)
6. Work order numbers and invoice numbers are auto-generated
7. Role-based access control is enforced on all endpoints

