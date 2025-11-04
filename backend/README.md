# Job Clock Sync Backend

Spring Boot backend API with JWT authentication and MongoDB.

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MongoDB running on localhost:27017

## Setup

1. Ensure MongoDB is running on `mongodb://localhost:27017/`

2. The database `jobclocksync` will be created automatically with the following collections:
   - `users` - User accounts with email index
   - `workorders` - Work orders
   - `jobs` - Job postings
   - `invoices` - Invoices
   - `timesheets` - Timesheets
   
   Default users will be created automatically when the backend starts for the first time.

3. Build and run the application:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Or on Windows:
```bash
cd backend
run.bat
```

The backend will start on `http://localhost:8082`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email and password
- `GET /api/auth/me` - Get current user information (requires auth)

### Work Orders
- `GET /api/work-orders` - Get work orders (vendor or company based on role)
- `POST /api/work-orders` - Create work order (company only)
- `PUT /api/work-orders/{id}/status?status={status}` - Update work order status
- `PUT /api/work-orders/{id}/assign?vendorId={vendorId}` - Assign work order to vendor (company only)

### Dashboard
- `GET /api/dashboard/vendor/stats` - Get vendor dashboard statistics (vendor only)
- `GET /api/dashboard/company/stats` - Get company dashboard statistics (company only)

## Default Users

The application automatically creates two demo users on startup:

1. **Vendor User**
   - Email: `vendor@hourglass.com`
   - Password: `password123`

2. **Company User**
   - Email: `company@hourglass.com`
   - Password: `password123`

## Security

- JWT tokens are used for authentication
- Tokens expire after 24 hours (86400000 ms)
- All endpoints except `/api/auth/**` require authentication
- CORS is configured to allow requests from http://localhost:8080

## Data Models

### User
- id, email (unique), password (hashed), name, role (VENDOR/COMPANY), active, timestamps

### WorkOrder
- id, workOrderNumber (unique), title, description, companyId, vendorId, status, dates, timestamps
- Status: DRAFT, OPEN, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED

### Job
- id, title, description, companyId, status, requiredSkills, location, salary, employmentType, applicantIds, timestamps

### Invoice
- id, invoiceNumber (unique), vendorId, companyId, workOrderId, status, amounts, items, dates, timestamps

### Timesheet
- id, vendorId, companyId, workOrderId, status, week dates, entries, totalHours, notes, dates, timestamps

