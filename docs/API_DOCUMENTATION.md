# FinSight AI — API Documentation

Base URL in the current development setup:

```text
http://127.0.0.1:5100/api
```

Protected endpoints expect:

```http
Authorization: Bearer <JWT_TOKEN>
```

## Authentication

### POST `/auth/register`

Creates a user account.

**Request**

```json
{
  "name": "Example User",
  "email": "user@example.com",
  "password": "password"
}
```

### POST `/auth/login`

Authenticates a user and returns authentication information.

**Request**

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

The frontend stores the returned token for authenticated requests.

### GET `/auth/me`

Protected endpoint that returns the authenticated user.

```http
Authorization: Bearer <JWT_TOKEN>
```

### PUT `/auth/profile`

Protected endpoint used by Settings to update profile information.

**Request**

```json
{
  "name": "Example User",
  "email": "user@example.com",
  "account_type": "Finance Admin"
}
```

## Transactions

### GET `/transactions`

Returns transactions belonging to the authenticated user.

### POST `/transactions`

Creates a transaction.

**Request**

```json
{
  "type": "income",
  "description": "Client payment",
  "category": "Revenue",
  "amount": 50000,
  "transaction_date": "2026-09-01",
  "status": "completed"
}
```

### DELETE `/transactions/:id`

Deletes a transaction belonging to the authenticated user.

### PUT `/transactions/:id/status`

Updates the status of an authenticated user's transaction.

**Request**

```json
{
  "status": "completed"
}
```

## Analytics

### GET `/analytics`

Returns financial analytics derived from PostgreSQL transactions.

The current analytics model calculates:

- Total income
- Total expenses
- Balance
- Savings rate
- Total transaction count
- Monthly income/expenses
- Expense totals grouped by category

## Reconciliation

### GET `/reconciliation`

Returns reconciliation data for the authenticated user.

The current response includes transaction records and summary values such as:

- Total transactions
- Matched transactions
- Pending transactions
- Total amount
- Matched amount
- Pending amount

## AI

### GET `/ai/insights`

Protected endpoint that generates a financial assessment from the user's financial data.

The AI insight structure contains:

```json
{
  "title": "...",
  "summary": "...",
  "recommendation": "...",
  "risk": "Low | Medium | High",
  "action": "..."
}
```

### POST `/ai/chat`

Protected endpoint used by the FinSight AI Assistant.

**Request**

```json
{
  "question": "What's my current balance?"
}
```

The service can answer data-specific questions using the authenticated user's financial records.

## Error Handling

The backend returns JSON error responses for authentication failures, invalid routes, and server errors.

Example:

```json
{
  "status": "error",
  "message": "Authentication token required"
}
```

A global Express error handler returns:

```json
{
  "status": "error",
  "message": "Internal server error"
}
```
