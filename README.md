# FinSight AI

**AI-Powered Financial Controller for Startups and Growing Businesses**

> A full-stack financial management platform built with **React, Node.js, Express.js, PostgreSQL, REST APIs, JWT authentication, financial analytics, transaction reconciliation, and AI-assisted insights.**

FinSight AI helps businesses monitor cash flow, manage transactions, analyze financial performance, reconcile financial records, and receive actionable insights from their transaction data.

**📸 Screenshots:** See the [`Screenshots/`](./Screenshots) directory
**📂 Repository:** This GitHub repository

---

## Overview

FinSight AI is a full-stack financial management application that combines a modern **React + Vite frontend**, **Node.js/Express.js REST API**, and **PostgreSQL database**.

The platform provides:

* Secure user authentication
* Financial dashboard and KPI tracking
* Transaction management
* Cash-flow analytics
* Expense-category analysis
* Transaction reconciliation
* AI-assisted financial insights
* Account and profile management
* Public landing page

The application is designed around a practical business use case: giving users a centralized view of financial activity while combining traditional financial analytics with AI-assisted decision support.

---

## Engineering Highlights

* Built a full-stack application using **React, Node.js, Express.js, and PostgreSQL**
* Implemented **JWT-based authentication** with protected API routes
* Designed user-scoped transaction data using a relational PostgreSQL model
* Built **RESTful APIs** for authentication, transactions, analytics, reconciliation, and AI insights
* Implemented financial KPI calculations including balance, savings rate, cash flow, and expense categories
* Built a transaction reconciliation workflow with matched and pending transaction states
* Structured the backend using **controllers, models, routes, middleware, and services**
* Implemented a backend financial insight service that analyzes authenticated user transaction data
* Created a responsive financial dashboard and analytics interface using React
* Separated frontend API communication through a dedicated service layer

---

## Key Features

### 1. Authentication

FinSight AI provides account authentication and protected access to financial data.

* User registration
* User login
* JWT-based authentication
* Protected API routes
* Current-user retrieval
* Profile management
* Logout/session controls
* Password hashing before database storage

---

### 2. Financial Dashboard

The dashboard provides an at-a-glance overview of a user's financial activity.

Key metrics include:

* Total balance
* Total income
* Total expenses
* Savings rate
* Monthly cash flow
* Recent transactions
* Financial insights

Financial figures are calculated from the authenticated user's stored transaction data.

---

### 3. Transaction Management

Users can manage their financial transactions directly from the application.

Capabilities include:

* Add income transactions
* Add expense transactions
* Assign transaction categories
* Set transaction dates
* Track transaction status
* View transaction history
* Delete transactions

Transactions are stored in PostgreSQL and associated with the authenticated user through `user_id`.

---

### 4. Financial Analytics

FinSight AI calculates and presents financial performance metrics including:

* Total income
* Total expenses
* Current balance
* Savings rate
* Transaction count
* Monthly income and expenses
* Cash-flow trends
* Expense totals by category

These calculations are generated from transaction data rather than hard-coded dashboard values.

---

### 5. Transaction Reconciliation

The reconciliation module provides visibility into transaction processing and matching status.

It includes:

* Total transactions
* Matched/completed transactions
* Pending transactions
* Total transaction amount
* Matched amount
* Pending amount

This creates a foundation for future integrations with bank statements, payment processors, and settlement systems.

---

### 6. AI-Assisted Financial Intelligence

The financial insight layer analyzes account-level transaction information and produces:

* Financial summaries
* Recommendations
* Risk indications
* Suggested actions
* Key expense information

The insight workflow uses the authenticated user's stored transaction data to calculate relevant financial metrics before generating the resulting financial guidance.

---

### 7. Account & Settings

Users can view and manage account information including:

* Profile information
* Registered email
* Account type
* Currency
* Session/logout controls

---

## Technology Stack

### Frontend

* **React**
* **Vite**
* **JavaScript**
* **React Router**
* **Lucide React**
* **CSS**

### Backend

* **Node.js**
* **Express.js**
* **REST APIs**
* **JWT**
* **bcrypt/bcryptjs**
* **dotenv**
* **CORS**

### Database

* **PostgreSQL**
* **SQL**

### AI

* Backend financial insight service
* AI-assisted financial analysis architecture
* Transaction-data-driven financial insights

---

## System Architecture

```text
                         ┌─────────────────────┐
                         │        User         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    React + Vite     │
                         │      Frontend       │
                         └──────────┬──────────┘
                                    │
                               REST API
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Express.js API    │
                         │      Backend        │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       Authentication        Transactions            Analytics
              │                     │                     │
              └─────────────────────┼─────────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     PostgreSQL      │
                         │      Database       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Financial Insight   │
                         │      Service        │
                         └─────────────────────┘
```

---

## Project Structure

```text
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
├── Screenshots/
├── docs/
└── README.md
```

---

## Database Design

The primary relationship between users and transactions is:

```text
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

* `id`
* `name`
* `email`
* `password`
* `account_type`
* `created_at`

### Transactions

Stores financial activity.

Important fields include:

* `id`
* `user_id`
* `type`
* `description`
* `category`
* `amount`
* `status`
* `transaction_date`
* `created_at`

Each transaction belongs to a user through `user_id`.

---

## API Endpoints

### Authentication

| Method | Endpoint             | Purpose                |
| ------ | -------------------- | ---------------------- |
| POST   | `/api/auth/register` | Register a user        |
| POST   | `/api/auth/login`    | Authenticate a user    |
| GET    | `/api/auth/me`       | Get authenticated user |
| PUT    | `/api/auth/profile`  | Update profile         |

### Transactions

| Method | Endpoint                       | Purpose                   |
| ------ | ------------------------------ | ------------------------- |
| GET    | `/api/transactions`            | Get user's transactions   |
| POST   | `/api/transactions`            | Create a transaction      |
| DELETE | `/api/transactions/:id`        | Delete a transaction      |
| PUT    | `/api/transactions/:id/status` | Update transaction status |

### Analytics

| Method | Endpoint         | Purpose                 |
| ------ | ---------------- | ----------------------- |
| GET    | `/api/analytics` | Get financial analytics |

### Reconciliation

| Method | Endpoint              | Purpose                 |
| ------ | --------------------- | ----------------------- |
| GET    | `/api/reconciliation` | Get reconciliation data |

### AI

| Method | Endpoint           | Purpose                     |
| ------ | ------------------ | --------------------------- |
| GET    | `/api/ai/insights` | Generate financial insights |

Protected endpoints require:

```text
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication Flow

```text
User
  │
  ▼
Login / Register
  │
  ▼
Express Authentication Route
  │
  ▼
Validate Credentials
  │
  ▼
Generate JWT
  │
  ▼
Frontend Stores Session Token
  │
  ▼
Protected API Requests
  │
  ▼
authMiddleware
  │
  ▼
Identify Authenticated User
  │
  ▼
User-Scoped Data Access
```

Passwords are hashed before storage and are not returned as part of normal user-profile responses.

---

## Analytics Flow

```text
PostgreSQL Transactions
          │
          ▼
     Analytics Model
          │
     ┌────┼──────────────┐
     ▼    ▼              ▼
   Income Expenses    Categories
     │    │              │
     └────┼──────────────┘
          ▼
   Analytics Controller
          │
          ▼
       REST API
          │
          ▼
    React Analytics UI
```

---

## AI Insight Flow

```text
Authenticated User
        │
        ▼
GET /api/ai/insights
        │
        ▼
Fetch User's Transactions
        │
        ▼
Calculate Financial Metrics
        │
        ▼
Financial Insight Service
        │
        ▼
Summary + Recommendations
        │
        ▼
Dashboard AI Insight
```

The insight pipeline is connected to authenticated transaction data rather than relying on static dashboard values.

---

## Environment Variables

Create a `.env` file inside `backend/`.

Example:

```env
PORT=5100
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finsight
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_secure_jwt_secret
```

**Never commit `.env`, passwords, JWT secrets, API keys, or other credentials to GitHub.**

---

## Running the Project

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* PostgreSQL

### 1. Start PostgreSQL

Make sure PostgreSQL is running and the `finsight` database exists.

### 2. Configure Environment Variables

Create:

```text
backend/.env
```

and provide the required PostgreSQL and JWT configuration.

### 3. Start the Backend

```bash
cd backend
npm install
node server.js
```

The backend runs on:

```text
http://127.0.0.1:5100
```

### 4. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will provide the local frontend URL.

---

## Production Hardening

For production-scale deployment, the following hardening steps are recommended:

* Store secrets using secure environment variables
* Restrict CORS to trusted production domains
* Enforce HTTPS
* Use strong JWT secrets
* Use managed/production PostgreSQL infrastructure
* Add request validation
* Add rate limiting
* Add structured application logging
* Add centralized error monitoring
* Implement production backup and recovery procedures

---

## Testing Checklist

### Authentication

* [x] Register
* [x] Login
* [x] Protected routes
* [x] Logout
* [x] Current-user retrieval

### Transactions

* [x] Create transaction
* [x] View transactions
* [x] Delete transaction
* [x] Update transaction status

### Dashboard

* [x] Financial summary
* [x] Cash-flow visualization
* [x] Recent transactions
* [x] Financial insight

### Analytics

* [x] Income
* [x] Expenses
* [x] Balance
* [x] Savings rate
* [x] Monthly cash flow
* [x] Category analysis

### Reconciliation

* [x] Transaction summary
* [x] Matched transactions
* [x] Pending transactions

### Settings

* [x] Profile information
* [x] Account information
* [x] Save/update functionality
* [x] Logout

---

## Future Enhancements

Potential future improvements include:

* Automated bank/UPI integrations
* Cash-flow forecasting
* Financial anomaly detection
* Automated settlement reconciliation
* Advanced financial reporting

---

## Project Objective

FinSight AI was built to demonstrate how a practical business application can combine:

**React + Node.js + Express.js + REST APIs + JWT authentication + PostgreSQL + financial analytics + reconciliation + AI-assisted decision support**

into a unified full-stack financial management platform.

The project focuses on both **user-facing financial visibility** and **backend engineering fundamentals**, including authentication, relational data modeling, API design, financial calculations, and service-oriented backend structure.

---

## Author

**Harshvardhan Mane**

FinSight AI
