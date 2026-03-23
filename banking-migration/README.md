# Banking Migration — Angular 17 + NestJS

A modern web application replicating the Oracle Forms 10g Online Banking System using Angular 17 (frontend) and NestJS (backend) with PostgreSQL.

## Architecture

- **Frontend**: Angular 17 with Angular Material
- **Backend**: NestJS with TypeORM
- **Database**: PostgreSQL 15
- **Auth**: JWT-based authentication with bcrypt password hashing

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Angular CLI (`npm install -g @angular/cli@17`)

## Quick Start

### 1. Start the database

```bash
make db-up
```

This starts PostgreSQL on port 5432 and pgAdmin on port 5050.

### 2. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Seed the database

```bash
make seed
```

This creates all tables and inserts a default manager account:
- **Username**: admin
- **Password**: Admin@123

### 4. Start the backend

```bash
make backend-dev
```

Backend runs on http://localhost:3000. Swagger docs at http://localhost:3000/api/docs.

### 5. Start the frontend

```bash
make frontend-dev
```

Frontend runs on http://localhost:4200.

## Default Credentials

| Role    | Username/Account | Password   |
|---------|-----------------|------------|
| Manager | admin           | Admin@123  |

## API Endpoints

### Auth
- `POST /api/auth/customer-login` — Customer login
- `POST /api/auth/manager-login` — Manager login
- `POST /api/auth/register` — Online registration

### Account Requests
- `POST /api/account-requests` — Create account request
- `GET /api/account-requests/:id/status` — Check request status

### Admin (Manager only)
- `GET /api/admin/pending-requests` — List pending requests
- `POST /api/admin/approve/:requestId` — Approve request
- `POST /api/admin/reject/:requestId` — Reject request
- `GET /api/admin/requests/:requestId` — Request details

### Transactions (Customer only)
- `POST /api/transactions` — Create transaction
- `GET /api/transactions?startDate=...&endDate=...` — Transaction history

## Testing

```bash
make test-all
```

Run backend tests only: `make test-backend`
Run frontend tests only: `make test-frontend`

## Project Structure

```
banking-migration/
├── docker-compose.yml
├── Makefile
├── README.md
├── backend/
│   ├── src/
│   │   ├── entities/          # TypeORM entities
│   │   ├── auth/              # Authentication module
│   │   ├── account-requests/  # Account request module
│   │   ├── admin/             # Manager admin module
│   │   ├── transactions/      # Transaction module
│   │   ├── common/            # Shared interceptors/guards
│   │   └── database/          # Seed scripts
│   └── test/                  # E2E tests
└── frontend/
    └── src/
        └── app/
            ├── core/          # Services, guards, interceptors
            ├── features/      # Feature modules (customer, manager)
            └── shared/        # Shared components, validators, models
```
