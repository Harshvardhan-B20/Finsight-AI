import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BrainCircuit,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Receipt,
  Settings,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const API_URL = "http://127.0.0.1:5000";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found.");
        setLoadingTransactions(false);
        return;
      }

      try {
        const response = await fetch(
          API_URL + "/api/transactions",
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch transactions."
          );
        }

        setTransactions(
          Array.isArray(data.transactions)
            ? data.transactions
            : []
        );
      } catch (err) {
        console.error("Transaction fetch error:", err);
        setError(
          err.message || "Unable to load transactions."
        );
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    });
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const transactionDate = new Date(date);
    const today = new Date();

    if (
      transactionDate.toDateString() ===
      today.toDateString()
    ) {
      return "Today";
    }

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (
      transactionDate.toDateString() ===
      yesterday.toDateString()
    ) {
      return "Yesterday";
    }

    return transactionDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  const financialSummary = useMemo(() => {
    const income = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0
      );

    const expenses = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0
      );

    const balance = income - expenses;

    const savingsRate =
      income > 0 ? (balance / income) * 100 : 0;

    return {
      income,
      expenses,
      balance,
      savingsRate,
    };
  }, [transactions]);

  return (
    <div className="dashboard-page">

      {/* SIDEBAR */}
      <aside
        className={
          "dashboard-sidebar " +
          (sidebarOpen ? "open" : "")
        }
      >
        <div className="sidebar-top">
          <Link to="/" className="dashboard-logo">
            FinSight<span>AI</span>
          </Link>

          <button
            className="close-sidebar"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-title">MAIN</p>

          {/* OVERVIEW */}
          <Link
            to="/dashboard"
            className="nav-item active"
            onClick={() => setSidebarOpen(false)}
          >
            <LayoutDashboard size={18} />
            Overview
          </Link>

          {/* TRANSACTIONS */}
          <Link
            to="/transactions"
            className="nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <Receipt size={18} />
            Transactions
          </Link>

          {/* ANALYTICS */}
          <Link
            to="/analytics"
            className="nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <BarChart3 size={18} />
            Analytics
          </Link>

          {/* RECONCILIATION */}
          <Link
            to="/reconciliation"
            className="nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <CreditCard size={18} />
            Reconciliation
          </Link>

          <p className="nav-title second-title">
            INTELLIGENCE
          </p>

          {/* AI INSIGHTS */}
          <a
            href="#ai-insights"
            className="nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <BrainCircuit size={18} />
            AI Insights
          </a>

          <p className="nav-title second-title">
            ACCOUNT
          </p>

          {/* SETTINGS */}
          <a
            href="#settings"
            className="nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <Settings size={18} />
            Settings
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="user-card">
            <div className="user-avatar">
              {userInitial}
            </div>

            <div>
              <strong>{userName}</strong>
              <span>Finance Admin</span>
            </div>
          </div>

          <Link to="/" className="logout-button">
            <LogOut size={17} />
            Logout
          </Link>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        {/* HEADER */}
        <header className="dashboard-header">
          <button
            className="menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>

          <div className="header-title">
            <h1>Financial Overview</h1>
            <p>
              Monitor your financial health at a glance.
            </p>
          </div>

          <button
            className="notification-button"
            aria-label="Notifications"
          >
            <Bell size={19} />
          </button>
        </header>

        <section
          className="dashboard-content"
          id="overview"
        >

          {/* WELCOME */}
          <div className="welcome-section">
            <div>
              <p className="welcome-label">
                GOOD MORNING
              </p>

              <h2>
                Welcome back, {userName} 👋
              </h2>

              <p>
                Here's what's happening with your finances
                today.
              </p>
            </div>

            <button className="date-button">
              August 2026
            </button>
          </div>

          {/* STATS */}
          <div className="stats-grid">

            {/* TOTAL BALANCE */}
            <div className="stat-card">
              <div className="stat-top">
                <span>Total Balance</span>

                <div className="stat-icon">
                  <Wallet size={18} />
                </div>
              </div>

              <h3>
                ₹{formatCurrency(financialSummary.balance)}
              </h3>

              <div className="stat-change positive-change">
                Live
                <span>from transactions</span>
              </div>
            </div>

            {/* TOTAL INCOME */}
            <div className="stat-card">
              <div className="stat-top">
                <span>Total Income</span>

                <div className="stat-icon">
                  <TrendingUp size={18} />
                </div>
              </div>

              <h3>
                ₹{formatCurrency(financialSummary.income)}
              </h3>

              <div className="stat-change positive-change">
                Income
                <span>from database</span>
              </div>
            </div>

            {/* TOTAL EXPENSES */}
            <div className="stat-card">
              <div className="stat-top">
                <span>Total Expenses</span>

                <div className="stat-icon expense-icon">
                  <ArrowDownRight size={18} />
                </div>
              </div>

              <h3>
                ₹{formatCurrency(financialSummary.expenses)}
              </h3>

              <div className="stat-change negative-change">
                Expenses
                <span>from database</span>
              </div>
            </div>

            {/* SAVINGS RATE */}
            <div className="stat-card">
              <div className="stat-top">
                <span>Savings Rate</span>

                <div className="stat-icon">
                  <BarChart3 size={18} />
                </div>
              </div>

              <h3>
                {financialSummary.savingsRate.toFixed(1)}%
              </h3>

              <div className="stat-change positive-change">
                Calculated
                <span>from live data</span>
              </div>
            </div>

          </div>

          {/* MAIN GRID */}
          <div className="dashboard-grid">

            {/* CASH FLOW */}
            <div
              className="dashboard-card chart-card"
              id="analytics"
            >
              <div className="card-header">
                <div>
                  <h3>Cash Flow</h3>
                  <p>Income vs expenses</p>
                </div>

                <select defaultValue="6">
                  <option value="6">
                    Last 6 months
                  </option>

                  <option value="12">
                    Last 12 months
                  </option>
                </select>
              </div>

              <div className="chart-area">
                <div className="chart-y-axis">
                  <span>20L</span>
                  <span>15L</span>
                  <span>10L</span>
                  <span>5L</span>
                  <span>0</span>
                </div>

                <div className="chart-content">
                  <div className="chart-grid-lines">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className="bar-chart">

                    <div className="month">
                      <div className="bars">
                        <i style={{ height: "55%" }} />
                        <i style={{ height: "30%" }} />
                      </div>
                      <span>Mar</span>
                    </div>

                    <div className="month">
                      <div className="bars">
                        <i style={{ height: "65%" }} />
                        <i style={{ height: "35%" }} />
                      </div>
                      <span>Apr</span>
                    </div>

                    <div className="month">
                      <div className="bars">
                        <i style={{ height: "72%" }} />
                        <i style={{ height: "40%" }} />
                      </div>
                      <span>May</span>
                    </div>

                    <div className="month">
                      <div className="bars">
                        <i style={{ height: "80%" }} />
                        <i style={{ height: "45%" }} />
                      </div>
                      <span>Jun</span>
                    </div>

                    <div className="month">
                      <div className="bars">
                        <i style={{ height: "88%" }} />
                        <i style={{ height: "38%" }} />
                      </div>
                      <span>Jul</span>
                    </div>

                    <div className="month">
                      <div className="bars">
                        <i style={{ height: "95%" }} />
                        <i style={{ height: "42%" }} />
                      </div>
                      <span>Aug</span>
                    </div>

                  </div>
                </div>
              </div>

              <div className="chart-legend">
                <span>
                  <i className="income-dot" />
                  Income
                </span>

                <span>
                  <i className="expense-dot" />
                  Expenses
                </span>
              </div>
            </div>

            {/* AI INSIGHT */}
            <div
              className="dashboard-card ai-card"
              id="ai-insights"
            >
              <div className="ai-heading">
                <div className="ai-icon">
                  <BrainCircuit size={21} />
                </div>

                <div>
                  <h3>AI Financial Insight</h3>
                  <p>FinSight Intelligence</p>
                </div>
              </div>

              <div className="ai-message">
                <h4>
                  {financialSummary.expenses <=
                  financialSummary.income
                    ? "Your cash flow looks healthy."
                    : "Your expenses need attention."}
                </h4>

                <p>
                  {transactions.length === 0
                    ? "Add transactions to receive personalized financial insights."
                    : "FinSight analyzed " +
                      transactions.length +
                      " transaction" +
                      (transactions.length === 1
                        ? ""
                        : "s") +
                      " from your account."}
                </p>

                <div className="ai-recommendation">
                  <strong>Recommendation</strong>

                  <p>
                    {financialSummary.income >
                    financialSummary.expenses
                      ? "Consider allocating a portion of your surplus toward investments or an emergency reserve."
                      : "Review your expenses and identify areas where spending can be reduced."}
                  </p>
                </div>
              </div>

              <button className="ai-button">
                View Full AI Analysis
              </button>
            </div>

          </div>

          {/* RECENT TRANSACTIONS */}
          <div
            className="dashboard-card transactions-card"
            id="transactions"
          >
            <div className="card-header">
              <div>
                <h3>Recent Transactions</h3>
                <p>Your latest financial activity</p>
              </div>

              <Link to="/transactions">
                View all
              </Link>
            </div>

            <div className="transaction-list">

              {loadingTransactions ? (
                <div className="transaction">
                  <div className="transaction-info">
                    <strong>
                      Loading transactions...
                    </strong>

                    <span>
                      Fetching your financial activity
                    </span>
                  </div>
                </div>

              ) : error ? (
                <div className="transaction">
                  <div className="transaction-info">
                    <strong>
                      Unable to load transactions
                    </strong>

                    <span>{error}</span>
                  </div>
                </div>

              ) : transactions.length === 0 ? (
                <div className="transaction">
                  <div className="transaction-info">
                    <strong>
                      No transactions yet
                    </strong>

                    <span>
                      Your financial activity will appear
                      here.
                    </span>
                  </div>
                </div>

              ) : (
                transactions
                  .slice(0, 5)
                  .map((transaction) => {
                    const isIncome =
                      transaction.type === "income";

                    return (
                      <div
                        className="transaction"
                        key={transaction.id}
                      >

                        <div
                          className={
                            "transaction-icon " +
                            (isIncome
                              ? "income-transaction"
                              : "expense-transaction")
                          }
                        >
                          {isIncome ? (
                            <ArrowDownRight size={17} />
                          ) : (
                            <ArrowUpRight size={17} />
                          )}
                        </div>

                        <div className="transaction-info">
                          <strong>
                            {transaction.description}
                          </strong>

                          <span>
                            {formatDate(
                              transaction.transaction_date
                            )}{" "}
                            • {transaction.category}
                          </span>
                        </div>

                        <div
                          className={
                            "transaction-amount " +
                            (isIncome
                              ? "income-amount"
                              : "expense-amount")
                          }
                        >
                          {isIncome ? "+" : "-"}₹
                          {formatCurrency(
                            transaction.amount
                          )}
                        </div>

                        <span
                          className={
                            "status " +
                            (transaction.status ===
                            "completed"
                              ? "completed"
                              : "pending")
                          }
                        >
                          {transaction.status
                            ? transaction.status
                                .charAt(0)
                                .toUpperCase() +
                              transaction.status.slice(1)
                            : "Pending"}
                        </span>

                      </div>
                    );
                  })
              )}

            </div>
          </div>

          {/* SETTINGS ANCHOR */}
          <div id="settings" />

        </section>
      </main>
    </div>
  );
}

export default Dashboard;