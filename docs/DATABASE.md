# FinSight AI — Database Documentation

## Database Technology

FinSight AI uses **PostgreSQL** for persistent financial and account data.

The backend connects through the `pg` package and a PostgreSQL connection pool defined in:

```text
backend/config/db.js
```

## Entity Relationship

```text
┌───────────────┐
│     users     │
├───────────────┤
│ id            │
│ name          │
│ email         │
│ password      │
│ account_type  │
│ created_at    │
└───────┬───────┘
        │
        │ 1 : N
        ▼
┌────────────────────┐
│    transactions    │
├────────────────────┤
│ id                 │
│ user_id            │
│ type               │
│ description        │
│ category           │
│ amount             │
│ status             │
│ transaction_date   │
│ created_at         │
└────────────────────┘
```

## Users

The user model supports:

- Creating a user
- Finding a user by email
- Finding a user by ID

Profile responses intentionally return account fields without exposing the stored password.

## Transactions

Transactions are scoped to the authenticated user through `user_id`.

The transaction model supports:

- Create
- Read by user
- Delete by transaction ID and user ID
- Update status by transaction ID and user ID

The SQL queries use parameter placeholders such as `$1`, `$2`, etc., rather than directly concatenating request values into SQL.

## Analytics Queries

The analytics model derives financial metrics from the `transactions` table.

### Financial summary

Calculates:

```text
income
expenses
balance = income - expenses
savingsRate = (balance / income) × 100
transaction count
```

### Monthly cash flow

Groups transactions by month and calculates income and expenses separately.

### Expense categories

Groups expense transactions by `category` and totals the recorded amount for each category.

## Reconciliation Data

The reconciliation model reads the authenticated user's transactions and separates:

```text
completed → matched
other statuses → pending
```

It also calculates total, matched, and pending amounts.

## Data Access Pattern

```text
Request
  │
  ▼
JWT authentication
  │
  ▼
Authenticated user ID
  │
  ▼
Parameterized PostgreSQL query
  │
  ▼
Database result
  │
  ▼
Controller response
```

## Local Database Setup

Create the database locally and configure the backend environment variables.

Example:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password


