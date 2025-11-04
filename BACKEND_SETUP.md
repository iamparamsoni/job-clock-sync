# Backend Setup Guide

## Overview

The backend is a Spring Boot application with MongoDB that provides RESTful APIs for the Job Clock Sync application.

## Architecture

### Technology Stack
- **Framework**: Spring Boot 3.2.0
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Spring Security with BCrypt password hashing
- **Build Tool**: Maven

### Data Models

1. **User** - User accounts (Vendor/Company)
   - Email (unique), password (hashed), name, role, active status

2. **WorkOrder** - Work orders management
   - Work order number (unique), title, description, status, dates
   - Links: companyId, vendorId

3. **Job** - Job postings
   - Title, description, requirements, salary, applicant tracking

4. **Invoice** - Invoicing system
   - Invoice number (unique), amounts, items, payment tracking

5. **Timesheet** - Time tracking
   - Week-based entries, hours logged, approval workflow

## Running the Backend

### Prerequisites
1. MongoDB running on `mongodb://localhost:27017/`
2. Java 17+ installed
3. Maven 3.6+ installed

### Steps

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Build and run:**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

   Or on Windows:
   ```bash
   run.bat
   ```

3. **Backend will start on:** `http://localhost:8082`

## API Endpoints

### Base URL: `http://localhost:8082/api`

### Authentication
- `POST /auth/login` - Login
  - Request: `{ "email": "string", "password": "string" }`
  - Response: `{ "token": "string", "id": "string", "email": "string", "name": "string", "role": "string" }`

- `GET /auth/me` - Get current user (requires Bearer token)

### Work Orders
- `GET /work-orders` - Get all work orders (role-based)
- `POST /work-orders` - Create work order (company only)
  - Request: `{ "title": "string", "description": "string", "dueDate": "string", "vendorId": "string" }`
- `PUT /work-orders/{id}/status?status={status}` - Update status
- `PUT /work-orders/{id}/assign?vendorId={vendorId}` - Assign to vendor

### Dashboard
- `GET /dashboard/vendor/stats` - Vendor dashboard stats
- `GET /dashboard/company/stats` - Company dashboard stats

## Default Users

Created automatically on first startup:

- **Vendor**: `vendor@hourglass.com` / `password123`
- **Company**: `company@hourglass.com` / `password123`

## Database

- **Database Name**: `jobclocksync`
- **Collections**: `users`, `workorders`, `jobs`, `invoices`, `timesheets`
- **Indexes**: 
  - `users.email` (unique)
  - `workorders.workOrderNumber` (unique)
  - `invoices.invoiceNumber` (unique)

## Security Features

- JWT token-based authentication
- Password encryption with BCrypt
- Role-based access control (VENDOR/COMPANY)
- CORS configured for frontend (http://localhost:8080)
- Token expiration: 24 hours

## Testing

1. Start MongoDB
2. Start the backend server
3. Test login endpoint:
   ```bash
   curl -X POST http://localhost:8082/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"vendor@hourglass.com","password":"password123"}'
   ```

## Troubleshooting

- **MongoDB connection error**: Ensure MongoDB is running on port 27017
- **Port 8082 already in use**: Change `server.port` in `application.properties`
- **CORS errors**: Verify frontend URL matches `cors.allowed-origins` in `application.properties`

