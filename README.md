# FinSight AI

**AI-Powered Financial Controller for Startups and Growing Businesses**

FinSight AI is a full-stack financial management application designed to
help businesses monitor cash flow, manage transactions, analyze
financial performance, reconcile records, and receive actionable
financial insights from their data.

------------------------------------------------------------------------

## Overview

FinSight AI combines a modern React dashboard with a Node.js/Express
REST API and PostgreSQL database.

The application provides:

-   Secure user authentication
-   Transaction management
-   Financial dashboard and KPIs
-   Cash-flow analytics
-   Expense-category analysis
-   Transaction reconciliation
-   Financial insights based on account data
-   Account/settings management
-   A professional public landing page

The project is designed as a practical full-stack application with a
focus on financial visibility and AI-assisted decision support.

------------------------------------------------------------------------

## Key Features

### 1. Authentication

-   User registration
-   User login
-   JWT-based authentication
-   Protected API routes
-   Current-user retrieval
-   Logout

### 2. Financial Dashboard

The dashboard provides an at-a-glance view of:

-   Total balance
-   Total income
-   Total expenses
-   Savings rate
-   Monthly cash flow
-   Recent transactions
-   Financial insights

All financial figures are calculated from the authenticated user's
transaction data.

### 3. Transaction Management

Users can:

-   Add income transactions
-   Add expense transactions
-   Assign categories
-   Set transaction dates
-   Track transaction status
-   Delete transactions

Transactions are stored in PostgreSQL and associated with the
authenticated user.

### 4. Analytics

FinSight AI calculates:

-   Total income
-   Total expenses
-   Balance
-   Savings rate
-   Total transaction count
-   Monthly income and expenses
-   Expense totals by category

### 5. Reconciliation

The reconciliation module provides:

-   Total transactions
-   Matched/completed transactions
-   Pending transactions
-   Total transaction amount
-   Matched amount
-   Pending amount

### 6. Financial Intelligence

The AI insight layer analyzes account-level financial information and
provides:

-   Financial summary
-   Recommendations
-   Risk indication
-   Suggested actions
-   Key expense information

The insight is generated from the user's actual stored transaction data
rather than static dashboard numbers.

### 7. Account Settings

Users can view and manage their FinSight account information, including:

-   Profile information
-   Registered email
-   Account type
-   Currency
-   Session/logout controls

------------------------------------------------------------------------

## Technology Stack

### Frontend

-   React
-   Vite
-   JavaScript
-   React Router
-   Lucide React
-   CSS

### Backend

-   Node.js
-   Express.js
-   REST APIs
-   JWT
-   bcrypt/bcryptjs
-   dotenv
-   CORS

### Database

-   PostgreSQL
-   SQL

### AI

-   Financial insight/AI service layer
-   Backend-side AI integration architecture

------------------------------------------------------------------------

## System Architecture

``` text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React + Vite      │
                    │     Frontend        │
                    └──────────┬──────────┘
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │   Express.js API    │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
      Authentication     Transactions       Analytics
             │                 │                 │
             └─────────────────┼─────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     PostgreSQL      │
                    │      Database       │
                    └─────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Financial Insight   │
                    │      Service        │
                    └─────────────────────┘
```

------------------------------------------------------------------------

## Project Structure

``` text
finsight-ai/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── Landing/
│   │   │   ├── Dashboard/
│   │   │   ├── Transactions/
│   │   │   ├── Analytics/
│   │   │   ├── Reconciliation/
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   └── Settings/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── analyticsController.js
│   │   ├── authController.js
│   │   ├── reconciliationController.js
│   │   └── transactionController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── analyticsModel.js
│   │   ├── reconciliationModel.js
│   │   ├── transactionModel.js
│   │   └── User.js
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── analyticsRoutes.js
│   │   ├── authRoutes.js
│   │   ├── reconciliationRoutes.js
│   │   └── transactionRoutes.js
│   ├── services/
│   │   └── aiService.js
│   ├── .env
│   ├── .gitignore
│   ├── server.js
│   └── package.json
│
└── README.md
```

------------------------------------------------------------------------

## Database Design

The primary relationship is:

``` text
Users
  │
  │ 1 ───────── N
  │
  ▼
Transactions
```

### Users

Stores account information and authentication data.

Important fields include:

-   `id`
-   `name`
-   `email`
-   `password`
-   `account_type`
-   `created_at`

### Transactions

Stores financial activity.

Important fields include:

-   `id`
-   `user_id`
-   `type`
-   `description`
-   `category`
-   `amount`
-   `status`
-   `transaction_date`
-   `created_at`

Each transaction belongs to a user through `user_id`.

------------------------------------------------------------------------

## API Endpoints

### Authentication

  Method   Endpoint               Purpose
  -------- ---------------------- ------------------------
  POST     `/api/auth/register`   Register a user
  POST     `/api/auth/login`      Authenticate a user
  GET      `/api/auth/me`         Get authenticated user
  PUT      `/api/auth/profile`    Update profile

### Transactions

  Method   Endpoint                         Purpose
  -------- -------------------------------- ---------------------------
  GET      `/api/transactions`              Get user's transactions
  POST     `/api/transactions`              Create a transaction
  DELETE   `/api/transactions/:id`          Delete a transaction
  PUT      `/api/transactions/:id/status`   Update transaction status

### Analytics

  Method   Endpoint           Purpose
  -------- ------------------ -------------------------
  GET      `/api/analytics`   Get financial analytics

### Reconciliation

  Method   Endpoint                Purpose
  -------- ----------------------- -------------------------
  GET      `/api/reconciliation`   Get reconciliation data

### AI

  Method   Endpoint             Purpose
  -------- -------------------- -----------------------------
  GET      `/api/ai/insights`   Generate financial insights

Protected endpoints require:

``` text
Authorization: Bearer <JWT_TOKEN>
```

------------------------------------------------------------------------

## Authentication Flow

``` text
User
  │
  ▼
Login
  │
  ▼
Express Auth Route
  │
  ▼
Validate credentials
  │
  ▼
Generate JWT
  │
  ▼
Frontend stores session token
  │
  ▼
Protected API requests
  │
  ▼
authMiddleware
  │
  ▼
Identify authenticated user
```

Passwords are hashed before storage and are never returned as part of
normal user-profile responses.

------------------------------------------------------------------------

## Analytics Flow

``` text
PostgreSQL Transactions
          │
          ▼
     Analytics Model
          │
    ┌─────┼───────────┐
    ▼     ▼           ▼
 Income Expenses   Categories
    │     │           │
    └─────┼───────────┘
          ▼
   Analytics Controller
          │
          ▼
      REST API
          │
          ▼
    React Analytics UI
```

------------------------------------------------------------------------

## AI Insight Flow

``` text
Authenticated User
       │
       ▼
GET /api/ai/insights
       │
       ▼
Fetch user's transactions
       │
       ▼
Calculate financial metrics
       │
       ▼
AI / Financial Insight Service
       │
       ▼
Summary + Recommendation
       │
       ▼
Dashboard AI Insight
```

------------------------------------------------------------------------

## Environment Variables

Create a `.env` file inside `backend/`.

Example:

``` env
PORT=5100
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finsight
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_secure_jwt_secret
```

Never commit `.env` or API keys to GitHub.

------------------------------------------------------------------------

## Running the Project

### 1. Start PostgreSQL

Make sure PostgreSQL is running and the `finsight` database exists.

### 2. Start Backend

``` bash
cd backend
npm install
node server.js
```

Backend:

``` text
http://127.0.0.1:5100
```

### 3. Start Frontend

Open another terminal:

``` bash
cd frontend
npm install
npm run dev
```

Vite will provide the local frontend URL.

------------------------------------------------------------------------

## Production Considerations

Before deploying FinSight AI publicly:

-   Move secrets to secure environment variables
-   Restrict CORS to the production frontend domain
-   Use HTTPS
-   Use a strong JWT secret
-   Add production database credentials
-   Add rate limiting
-   Add request validation
-   Add structured logging
-   Add centralized error monitoring
-   Use a production PostgreSQL instance

------------------------------------------------------------------------

## Testing Checklist

### Authentication

-   [x] Register
-   [x] Login
-   [x] Protected routes
-   [x] Logout
-   [x] Current-user retrieval

### Transactions

-   [x] Create transaction
-   [x] View transactions
-   [x] Delete transaction
-   [x] Update transaction status

### Dashboard

-   [x] Financial summary
-   [x] Cash-flow visualization
-   [x] Recent transactions
-   [x] Financial insight

### Analytics

-   [x] Income
-   [x] Expenses
-   [x] Balance
-   [x] Savings rate
-   [x] Monthly cash flow
-   [x] Category analysis

### Reconciliation

-   [x] Transaction summary
-   [x] Matched transactions
-   [x] Pending transactions

### Settings

-   [x] Profile information
-   [x] Account information
-   [x] Save/update functionality
-   [x] Logout

------------------------------------------------------------------------

## Future Enhancements

Potential future versions could include:

-   Interactive AI financial assistant/chatbot
-   Automated bank/UPI integrations
-   Razorpay settlement reconciliation
-   Cash-flow forecasting
-   Financial anomaly detection
-   Tax-line matching
-   Advanced financial reports
-   CSV/PDF report exports
-   Role-based access control
-   Notifications and financial alerts
-   Production cloud deployment

------------------------------------------------------------------------

## Project Objective

FinSight AI was built to demonstrate how a full-stack application can
combine:

**React + REST APIs + authentication + PostgreSQL + financial
analytics + AI-assisted decision support**

into one practical business-focused system.

------------------------------------------------------------------------

## Author

**Harshvardhan Mane**

FinSight AI
