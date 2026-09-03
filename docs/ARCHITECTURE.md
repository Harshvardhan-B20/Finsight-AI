# FinSight AI — Architecture

## 1. High-Level Flow

```text
React UI
   │
   │ HTTP requests
   ▼
Express.js REST API
   │
   ├── Authentication middleware
   ├── Controllers
   ├── Models
   │
   ▼
PostgreSQL
```

The AI path additionally connects the backend financial data to the AI service:

```text
Authenticated request
        │
        ▼
AI Controller
        │
        ▼
Fetch financial data
        │
        ▼
AI Service
        │
        ▼
Gemini model
        │
        ▼
Financial insight / answer
        │
        ▼
React UI
```

## 2. Frontend Architecture

The React application is organized around pages, reusable components, layouts, hooks, services, context, and utilities.

### Main pages

- Landing
- Login
- Register
- Dashboard
- Transactions
- Analytics
- Reconciliation
- AI Assistant
- Settings

Routing is handled by React Router.

API communication is centralized partly through `frontend/src/services/api.js`, while feature pages also make authenticated requests directly where required.

## 3. Backend Architecture

The backend follows a route → controller → model/service separation.

```text
routes/
   │
   ▼
controllers/
   │
   ├──────────────► models/ ─────► PostgreSQL
   │
   └──────────────► services/ ───► AI provider
```

### Routes

Define HTTP endpoints and attach authentication middleware where required.

### Controllers

Handle request/response logic and coordinate models/services.

### Models

Contain database operations and financial data queries.

### Middleware

`authMiddleware.js` reads the Bearer token, verifies the JWT, and attaches the decoded user information to `req.user`.

### Services

`aiService.js` contains the financial insight and AI chat logic.

## 4. Authentication Flow

```text
Register/Login
     │
     ▼
Auth Controller
     │
     ├── bcrypt password handling
     │
     └── JWT generation
             │
             ▼
        Frontend stores token
             │
             ▼
Protected request
             │
             ▼
       authMiddleware
             │
             ▼
        req.user
```

The protected routes use the authenticated user ID to scope database queries.

## 5. Financial Data Flow

```text
PostgreSQL transactions
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
     Analytics UI
```

## 6. Reconciliation Flow

The reconciliation model retrieves the authenticated user's transactions and derives:

- Total transaction count
- Matched/completed count
- Pending count
- Total amount
- Matched amount
- Pending amount

A pending transaction can be updated through:

```text
PUT /api/transactions/:id/status
```

with a completed status.

## 7. AI Flow

The AI service receives financial information derived from the user's stored transaction data.

For insights, the service provides transaction count, income, expenses, balance, savings rate, highest expense information, and transaction records to the configured AI provider.

The service requests a structured JSON response containing:

- title
- summary
- recommendation
- risk
- action

If AI generation fails, the service contains a deterministic fallback analysis based on the financial metrics.

For chat, the service handles common financial questions directly from the user's data and can use the AI provider for broader financial analysis.

## 8. API-to-UI Relationship

```text
Dashboard          → /api/transactions
                   → /api/ai/insights

Transactions       → /api/transactions
                   → /api/transactions/:id/status
                   → /api/transactions/:id

Analytics          → /api/analytics

Reconciliation     → /api/reconciliation
                   → /api/transactions/:id/status

AI Assistant       → /api/ai/chat

Settings           → /api/auth/profile
```
