# FinSight AI

## AI-Powered Financial Controller for Startups & Growing Businesses

FinSight AI is a full-stack financial management platform that helps businesses monitor transactions, understand cash flow, analyze expenses, reconcile financial records, and interact with an AI-powered financial assistant.

The application combines a React frontend, Node.js/Express backend, PostgreSQL database, and AI services to provide real-time financial insights based on transaction data.

---

## Features

### Dashboard
- Real-time financial overview
- Total income
- Total expenses
- Current balance
- Savings rate
- Financial Health Score
- Cash-flow visualization
- Spending overview
- Recent transaction activity
- AI-generated financial insights

### Transaction Management
- Add income and expense transactions
- Categorize transactions
- View transaction history
- Update transaction status
- Delete transactions
- User-specific transaction data

### Analytics
- Income and expense analysis
- Monthly cash-flow analysis
- Expense category breakdown
- Financial performance metrics
- Data-driven financial summaries

### Reconciliation
- Financial reconciliation workflow
- Reconciliation records
- Exception-oriented financial tracking
- Backend API integration

### AI Financial Insights
- AI-generated financial analysis
- Spending analysis
- Financial health observations
- Expense reduction suggestions
- Data-driven recommendations

### AI Assistant
Users can ask questions about their financial data, such as:

- What is my balance?
- How much did I spend?
- What are my total expenses?
- What is my savings rate?
- What is my biggest expense?
- How much did I spend on rent?
- Analyze my spending.
- How healthy are my finances?

The assistant uses the authenticated user's transaction data to generate relevant responses.

### Authentication
- User registration
- User login
- JWT-based authentication
- Protected backend APIs
- User-specific financial data

### Settings
- User profile management
- Account settings
- Profile update functionality

---

## Tech Stack

### Frontend
- React
- Vite
- React Router
- JavaScript
- CSS
- Lucide React

### Backend
- Node.js
- Express.js
- REST APIs
- JWT Authentication
- bcrypt

### Database
- PostgreSQL

### AI
- Google Gemini API
- AI-powered financial analysis
- AI financial assistant

---

## System Architecture

```text
                    ┌──────────────────────┐
                    │      User / UI       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    React + Vite      │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   Node.js + Express  │
                    │       Backend        │
                    └──────┬───────┬───────┘
                           │       │
                 ┌─────────┘       └──────────┐
                 ▼                            ▼
        ┌─────────────────┐          ┌─────────────────┐
        │   PostgreSQL    │          │   AI Service    │
        │    Database     │          │ Gemini / AI     │
        └─────────────────┘          └─────────────────┘